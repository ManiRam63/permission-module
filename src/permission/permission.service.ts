import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../abstract';
import { IPermission } from '../types';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
export const allowedFieldsToSort = ['name'];
@Injectable({})
export class PermissionService extends BaseService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
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
      if (permission.length > 0) {
        let count = 0;
        const totalVal = permission.length;
        const returnObj = [];
        for (const element of permission) {
          const sidebarId = element?.sidebar;
          data.role = role;
          data.sidebar = sidebarId;
          data.create = element?.create;
          data.update = element?.update;
          data.delete = element?.delete;
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
      this._getBadRequestError(error.message);
    }
  }

  /**
   * @param id
   * @returns {id , data}
   * @description :This function is used to update Permission via Id
   *
   */
  async update(id: string, data) {
    try {
      const { role, permission } = data;
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.PERMISSION.INVALID_PERMISSION_Id,
        );
      }
      if (permission.length > 0) {
        for (const element of permission) {
          const sidebarId = element?.sidebar;
          const dataObj = {
            role: role,
            sidebar: sidebarId,
            create: element?.create || false,
            update: element?.update || false,
            delete: element?.delete || false,
            view: element?.view || false,
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
        }
      }
    } catch (error) {
      this._getBadRequestError(error.message);
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
   * @param {id}
   * @returns {Object}
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
      permission.andWhere('permission.id = :id', { id });
      permission.select(['sidebar', 'role', 'permission']);

      return await permission.getOne();
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }

  /**
   * @param {id}
   * @returns {dataObject}
   * @description : This function is used to get users Permission data according to role
   */
  async getUserPermissions(data) {
    try {
      const id = data?.role?.id;
      const permission =
        this.permissionRepository.createQueryBuilder('permission');
      permission.leftJoinAndSelect('permission.role', 'role');
      permission.leftJoinAndSelect('permission.sidebar', 'sidebar');
      permission.andWhere('permission.role.id = :id', { id });
      permission.select(['sidebar', 'permission']);

      const results: any = await this._paginate<IPermission>(permission, {
        limit: data.limit || 10,
        page: data.page || 1,
      });
      const sidebar: any = [];
      // this one modify due to permissions need to push according to side bar data
      for (const result of results.items) {
        const sideBarData: any = result.sidebar;
        const permission = {
          create: result?.create,
          view: result?.view,
          update: result?.update,
          read: result?.read,
          delete: result?.delete,
        };
        sideBarData.permission = permission;
        sidebar.push(sideBarData);
      }
      return sidebar;
    } catch (error) {
      return this._getInternalServerError(error.message);
    }
  }
}
