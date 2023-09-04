import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './action.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseService } from '../abstract';
import { IAction } from '../types';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
export const allowedFieldsToSort = ['name'];

@Injectable({ scope: Scope.REQUEST })
export class ActionService extends BaseService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    // @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super();
  }
  /**
   * @param
   * @returns {dataObject}
   * @description :This function is used to create action for permission
   */
  async create(data: Partial<IAction>) {
    const { name } = data;
    try {
      const IsExist = await this.find({
        name: name,
      });
      if (IsExist) {
        return this._getNotFoundError(RESPONSE_MESSAGES.ACTION.ALREADY_EXIST);
      }
      const created = this.actionRepository.create(data);
      return await this.actionRepository.save(created);
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
  async update(id: string, data: Partial<IAction>) {
    try {
      const { name } = data;
      const IsExist = await this.find({ id: id });

      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ACTION.INVALID_ACTION_Id,
        );
      }
      if (name != IsExist?.name) {
        const IsExist = await this.find({ name: name });
        if (IsExist) {
          return this._getNotFoundError(RESPONSE_MESSAGES.ACTION.ALREADY_EXIST);
        }
      }
      const result = await this.actionRepository.update(id, data);
      if (result?.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.ACTION.UPDATE_SUCCESSFULLY,
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
  async updateStatus(id: string, data: Partial<IAction>) {
    try {
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ACTION.INVALID_ACTION_Id,
        );
      }

      const result = await this.actionRepository.update(id, data);
      if (result?.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.ACTION.UPDATE_SUCCESSFULLY,
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
      return await this.actionRepository.findOne({
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
      const { search, action, sort } = data;
      const qr = this.actionRepository.createQueryBuilder('action');
      qr.select(['action.id', 'action.name', 'action.status']);
      if (sort) {
        const param = this.buildSortParams<{
          name: string;
        }>(sort); //check if param is one of keys
        if (allowedFieldsToSort.includes(param[0])) {
          if (param[0] === 'name') {
            qr.orderBy(`action.${param[0]}`, param[1]);
          }
        }
      } else {
        qr.orderBy('action.createdAt', 'ASC');
      }
      if (action) {
        qr.andWhere('action.name ILIKE :name', {
          name: '%' + action + '%',
        });
      }
      if (search) {
        qr.andWhere('action.name ILIKE :search', {
          search: '%' + search + '%',
        });
      }
      return await this._paginate<IAction>(qr, {
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
          RESPONSE_MESSAGES.ACTION.INVALID_ACTION_Id,
        );
      }
      return await this.actionRepository.findOne({
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
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.ACTION.INVALID_ACTION_Id,
        );
      }
      const result = await this.actionRepository.delete(id);
      if (result?.affected > 0) {
        return {
          message: RESPONSE_MESSAGES.ACTION.ACTION_DELETED_SUCCESSFULLY,
        };
      } else {
        this._getBadRequestError(RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      return this._getInternalServerError(error.message);
    }
  }
}
