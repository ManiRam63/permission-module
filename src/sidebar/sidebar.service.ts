import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sidebar } from './sidebar.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseService } from '../abstract';
import { ISidebar } from '../types';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
export const allowedFieldsToSort = ['url', 'slug', 'status', 'name'];

const AllowParams = Object.freeze({
  SLUG: 'sidebar', // add sidebar slug here
  ADD: 'add', // add actions here
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
});
@Injectable({ scope: Scope.REQUEST })
export class SidebarService extends BaseService {
  constructor(
    @InjectRepository(Sidebar)
    private readonly sidebarRepository: Repository<Sidebar>,
    private readonly authService: AuthService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super();
  }
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
   * @description :This function is used to create sidebar
   */
  async create(data: Partial<ISidebar>) {
    const { name, displayOrder, slug, url } = data;
    try {
      await this.decodePermission(AllowParams.ADD);
      const IsExistName = await this.find({
        name: name,
      });
      if (IsExistName) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.SIDEBAR.SIDEBAR_IS_ALREADY_EXIST,
        );
      }
      // check if sidebar url already exist of not

      const IsExistUrl = await this.find({
        url: url,
      });
      if (IsExistUrl) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.SIDEBAR.SIDEBAR_URL_ALREADY_EXIST,
        );
      }
      const created = this.sidebarRepository.create(data);
      return await this.sidebarRepository.save(created);
    } catch (error) {
      this.customErrorHandle(error);
    }
  }

  /**
   * @param {object}
   * @returns {dataObject}
   * @description : This function is used to check data already Exist or not with object data
   */
  async find(dataObject: object) {
    try {
      await this.decodePermission(AllowParams.VIEW);
      return await this.sidebarRepository.findOne({
        where: dataObject,
      });
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }

  /**
   * @param id
   * @returns {dataObject}
   * @description :This function is used to update user
   */
  async update(id: string, data: Partial<ISidebar>) {
    try {
      await this.decodePermission(AllowParams.UPDATE);
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(RESPONSE_MESSAGES.SIDEBAR.ID_NOT_VALID);
      }
      data.id = id;
      const user = await this.sidebarRepository.preload(data);
      const saved = await this.sidebarRepository.save(user);
      return saved;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  /**
   * @param {object}
   * @returns {dataObject}
   * @description : This function is used to get sidebar by id
   */
  async findById(id: string) {
    try {
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(RESPONSE_MESSAGES.SIDEBAR.ID_NOT_VALID);
      }
      return await this.sidebarRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }
  /**
   * @param {object}
   * @returns {dataObject}
   * @description : This function is used to get sidebar data with filters and sort by and order by display order
   */
  async findAll(data: any) {
    try {
      await this.decodePermission(AllowParams.VIEW);
      const { search, sort, slug } = data;
      const qr = this.sidebarRepository.createQueryBuilder('sidebar');
      qr.select([
        'sidebar.id',
        'sidebar.displayOrder',
        'sidebar.name',
        'sidebar.slug',
        'sidebar.url',
        'sidebar.status',
        'sidebar.icon',
      ]);
      if (sort) {
        const param = this.buildSortParams<{
          name: string;
          slug: string;
          url: string;
        }>(sort); //check if param is one of keys
        if (allowedFieldsToSort.includes(param[0])) {
          if (param[0] === 'slug') {
            qr.orderBy(`sidebar.${param[0]}`, param[1]);
          }
          if (param[0] === 'name') {
            qr.orderBy(`sidebar.${param[0]}`, param[1]);
          }
          if (param[0] === 'url') {
            qr.orderBy(`sidebar.${param[0]}`, param[1]);
          }
        }
      } else {
        qr.orderBy('sidebar.displayOrder', 'ASC');
      }
      if (slug) {
        qr.andWhere('sidebar.slug ILIKE :slug', {
          slug: '%' + slug + '%',
        });
      }
      if (search) {
        qr.andWhere(
          'sidebar.name ILIKE :search OR sidebar.slug ILIKE :search OR sidebar.url ILIKE :search',
          {
            search: '%' + search + '%',
          },
        );
      }

      return await this._paginate<ISidebar>(qr, {
        limit: data.limit || 10,
        page: data.page || 1,
      });
    } catch (err) {
      this._getInternalServerError(err.message);
    }
  }
}
