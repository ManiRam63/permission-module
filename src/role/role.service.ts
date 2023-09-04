import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Inject, Injectable, Scope, forwardRef } from '@nestjs/common';
import { BaseService } from '../abstract';
import { IRole } from '../types';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { AuthService } from 'src/auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
export const allowedFieldsToSort = ['name'];
const AllowParams = Object.freeze({
  SLUG: 'role', // add sidebar slug here
  ADD: 'add', // add actions here
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
});
@Injectable({ scope: Scope.REQUEST })
export class RoleService extends BaseService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super();
  }
  /**
   * @param :action
   * @returns {}
   * @description :This function is used to create role for user base
   */
  async decodePermission(action: string) {
    const userReq = this.request;
    // try {
    //   return await this.authService.getPermission(
    //     userReq,
    //     AllowParams.SLUG,
    //     action,
    //   );
    // } catch (error) {
    //   this.customErrorHandle(error);
    // }
    return true;
  }
  /**
   * @param
   * @returns {dataObject}
   * @description :This function is used to create role for user base
   */
  async create(data: Partial<IRole>) {
    const { name } = data;
    try {
      // await this.decodePermission(AllowParams.ADD);
      const IsExist = await this.find({
        name: name,
      });
      if (IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ROLE.ROLE_IS_ALREADY_EXIST,
        );
      }
      const created = this.roleRepository.create(data);
      return await this.roleRepository.save(created);
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  /**
   * @param id
   * @returns {id , data}
   * @description :This function is used to update role
   *
   */
  async update(id: string, data: Partial<IRole>) {
    try {
      await this.decodePermission(AllowParams.UPDATE);
      const { name } = data;
      const IsExist = await this.find({ id: id });

      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ROLE.ROLE_ID_IS_NOT_VALID,
        );
      }
      if (name != IsExist?.name) {
        const IsExist = await this.find({ name: name });
        if (IsExist) {
          return this._getNotFoundError(
            RESPONSE_MESSAGES.ROLE.ROLE_NAME_IS_ALREADY_EXIST,
          );
        }
      }
      const result = await this.roleRepository.update(id, data);
      if (result?.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.ROLE.ROLE_UPDATED_SUCCESSFULLY,
        };
      } else {
        this._getBadRequestError(RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
  // updateStatus
  /**
   * @param id
   * @returns {id , data}
   * @description :This function is used to update role
   *
   */
  async updateStatus(id: string, data: Partial<IRole>) {
    try {
      await this.decodePermission(AllowParams.UPDATE);
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ROLE.ROLE_ID_IS_NOT_VALID,
        );
      }

      const result = await this.roleRepository.update(id, data);
      if (result?.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.ROLE.ROLE_STATUS_UPDATED,
        };
      } else {
        this._getBadRequestError(RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG);
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
      return await this.roleRepository.findOne({
        where: dataObject,
      });
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }

  /**
   * @param {}
   * @returns {}
   * @description : This function is used to get role data
   */
  async findAll(data: any) {
    try {
      await this.decodePermission(AllowParams.VIEW);
      const { search, role, sort } = data;
      const qr = this.roleRepository.createQueryBuilder('role');
      qr.select(['role.id', 'role.name', 'role.status']);
      if (sort) {
        const param = this.buildSortParams<{
          name: string;
        }>(sort); //check if param is one of keys
        if (allowedFieldsToSort.includes(param[0])) {
          if (param[0] === 'name') {
            qr.orderBy(`role.${param[0]}`, param[1]);
          }
        }
      } else {
        qr.orderBy('role.createdAt', 'ASC');
      }
      if (role) {
        qr.andWhere('role.name ILIKE :role', {
          role: '%' + role + '%',
        });
      }
      if (search) {
        qr.andWhere('role.name ILIKE :search', {
          search: '%' + search + '%',
        });
      }
      return await this._paginate<IRole>(qr, {
        limit: data.limit || 10,
        page: data.page || 1,
      });
    } catch (err) {
      this._getInternalServerError(err.message);
    }
  }

  /**
   * @param {id}
   * @returns {Object}
   * @description : This function is used to get role data via id
   */
  async findById(id: string) {
    try {
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ROLE.ROLE_ID_IS_NOT_VALID,
        );
      }
      return await this.roleRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }

  /**
   * @param {id}
   * @returns {true, false}
   * @description : This function is used to delete role
   */
  async delete(id) {
    try {
      await this.decodePermission(AllowParams.DELETE);
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ROLE.ROLE_ID_IS_NOT_VALID,
        );
      }
      const result = await this.roleRepository.delete(id);
      if (result?.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.ROLE.ROLE_DELETED_SUCCESSFULLY,
        };
      } else {
        this._getBadRequestError(RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      return this._getInternalServerError(error.message);
    }
  }
}
