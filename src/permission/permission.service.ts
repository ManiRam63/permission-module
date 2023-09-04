import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../abstract';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { RoleService } from 'src/role/role.service';
import { Sidebar } from 'src/sidebar/sidebar.entity';
export const allowedFieldsToSort = ['name'];
@Injectable({})
export class PermissionService extends BaseService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly roleService: RoleService,
    @InjectRepository(Sidebar)
    private readonly sidebarRepository: Repository<Sidebar>,
  ) {
    super();
  }

  /**
   * @param
   * @returns {dataObject}
   * @description :This function is used to create role for user base
   */
  async create(data) {
    try {
      const { role, permission } = data;
      const IsExistRole = await this.roleService.find({ id: role });
      if (!IsExistRole) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.PERMISSION.ROLE_IS_NOT_EXIST,
        );
      }
      if (permission.length > 0) {
        let count = 0;
        const totalVal = permission.length;
        const returnObj = [];
        for (const element of permission) {
          const sidebarId = element?.sidebar;
          const actionId = element?.action;
          const alreadyHasPermission = await this.checkPermissionIsExist(
            sidebarId,
            actionId,
            role,
          );
          if (alreadyHasPermission) {
            return this._getNotFoundError(
              RESPONSE_MESSAGES.PERMISSION.THIS_PERMISSION_IS_ALREADY_EXIST,
            );
          }
          data.role = role;
          data.sidebar = sidebarId;
          data.action = actionId;
          const created = this.permissionRepository.create(data);
          const result = await this.permissionRepository.save(created);
          returnObj.push(result);
          count++;
        }
        if (count === totalVal) {
          return {
            permission: returnObj,
          };
        }
      }
    } catch (error) {
      this.customErrorHandle(error);
    }
  }

  /**
   * @param  id
   * @param data
   * @returns  data in array
   * @description :This function is used to update Permission via Id
   */
  async update(id: string, data) {
    try {
      const { role, permission } = data;
      // check if permission id is available or not
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.PERMISSION.INVALID_PERMISSION_Id,
        );
      }
      //check if role is exist or not
      const IsExistRole = await this.roleService.find({ id: role });
      if (!IsExistRole) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.PERMISSION.ROLE_IS_NOT_EXIST,
        );
      }
      const sidebarId = permission?.sidebar;
      const actionId = permission?.action || null;
      if (actionId) {
        const checkPermission = await this.checkPermissionIsExist(
          sidebarId,
          actionId,
          role,
        );
        if (checkPermission) {
          this._getNotFoundError(
            RESPONSE_MESSAGES.PERMISSION.THIS_PERMISSION_IS_ALREADY_EXIST,
          );
        }
      }
      const dataObj = {
        role: role,
        sidebar: sidebarId,
        action: actionId,
      };
      const result = await this.permissionRepository.update(id, dataObj);
      if (result.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.PERMISSION.UPDATE_SUCCESSFULLY,
        };
      } else {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG,
        );
      }
    } catch (error) {
      this.customErrorHandle(error);
    }
  }
  /**
   * @param {object}
   * @returns {}
   * @description : This function is used to check data already Exist or not with object data
   */
  async find(dataObject: object) {
    try {
      return await this.permissionRepository.findOne({
        where: dataObject,
      });
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }
  /**
   * @param roleId
   * @returns {}
   * @description : This function is used to check role is already exist or not
   * */
  async findByRoleId(roleId: string) {
    try {
      const permission =
        this.permissionRepository.createQueryBuilder('permission');
      permission.leftJoinAndSelect('permission.role', 'role');
      permission.where('role.id =:id', { id: roleId });
      return await permission.getOne();
    } catch (err) {
      return this.customErrorHandle(err);
    }
  }

  /**
   * @param id
   * @returns {dataObject}
   * @description : this function is used to get permission data according to id
   */
  async findById(id: string) {
    try {
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.PERMISSION.INVALID_PERMISSION_Id,
        );
      }
      const permission =
        this.permissionRepository.createQueryBuilder('permission');
      permission.leftJoinAndSelect('permission.role', 'role');
      permission.leftJoinAndSelect('permission.sidebar', 'sidebar');
      permission.leftJoinAndSelect('permission.action', 'action');
      permission.andWhere('permission.id = :id', { id });
      permission.select(['sidebar', 'role', 'permission', 'action']);
      return await permission.getOne();
    } catch (err) {
      return this.customErrorHandle(err);
    }
  }

  /**
   * @param {data}
   * @returns {dataObject}
   * @description : This function is used to get users Permission data according to role
   */
  async getUserPermissions(data) {
    try {
      const id = data?.role?.id;
      if (!id) {
        return [];
      }
      const permissions = (await this.sidebarRepository
        .createQueryBuilder('sidebar')
        .leftJoinAndSelect('sidebar.permission', 'permission')
        .leftJoinAndSelect('permission.role', 'role')
        .leftJoinAndSelect('permission.action', 'action')
        .where('role.id = :id', { id })
        .select(['sidebar', 'permission.id', 'action'])
        .getMany()) as any;
      const sidebar = permissions.map((y) => {
        const actions = y.permission.map((x) => x.action);
        delete y.permission;
        return { ...y, actions };
      });
      return sidebar;
    } catch (error) {
      return this._getInternalServerError(error.message);
    }
  }
  /**
   *
   * @param sidebarId
   * @param actionId
   * @returns recordObject
   * @description:this function is used to get permission is already exist of not
   */
  async checkPermissionIsExist(sidebarId, actionId, role = null) {
    try {
      const permission =
        this.permissionRepository.createQueryBuilder('permission');
      permission.leftJoinAndSelect('permission.sidebar', 'sidebar');
      permission.leftJoinAndSelect('permission.action', 'action');
      permission.leftJoinAndSelect('permission.role', 'role');
      permission.andWhere(
        'role.id =:role  AND action.id =:action AND sidebar.id =:sidebar',
        { role: role, action: actionId, sidebar: sidebarId },
      );
      return await permission.getOne();
    } catch (error) {
      return this.customErrorHandle(error);
    }
  }

  /**
   *
   * @param sidebarId
   * @param actionId
   * @returns recordObject
   * @description:this function is used to get record by sidebar and role id
   */
  async getRecordBySidebarAndRole(sidebarId, roleId) {
    try {
      const permission =
        this.permissionRepository.createQueryBuilder('permission');
      permission.leftJoinAndSelect('permission.sidebar', 'sidebar');
      permission.leftJoinAndSelect('permission.role', 'role');
      permission.leftJoinAndSelect('permission.action', 'action');
      permission.andWhere('permission.action IS NOT NULL');
      permission.andWhere('role.id =:role AND sidebar.id =:sidebar', {
        role: roleId,
        sidebar: sidebarId,
      });
      return await permission.getMany();
    } catch (error) {
      return this.customErrorHandle(error);
    }
  }
}
