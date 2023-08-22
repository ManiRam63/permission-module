import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../abstract';
import { IUser } from '../types';
import * as bcrypt from 'bcrypt';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
export const allowedFieldsToSort = ['phone', 'status', 'name'];
@Injectable({})
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  /**
   * @param id
   * @returns {dataObject}
   * @description :This function is used to create user
   */
  async create(data: Partial<IUser>) {
    const { email, password } = data;
    try {
      const IsExist = await this.find({ email: email });
      if (IsExist) {
        return this._getNotFoundError(
          RESPONSE_MESSAGES.USER.EMAIL_IS_ALREADY_EXIST,
        );
      }
      // create password //
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      data.password = hashedPassword;
      const created = this.userRepository.create(data);
      const saved = await this.userRepository.save(created);
      delete saved?.password;
      return saved;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  /**
   * @param id
   * @returns {dataObject}
   * @description :This function is used to update user
   */
  async update(id: string, data: Partial<IUser>) {
    try {
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(RESPONSE_MESSAGES.USER.USER_ID_NOT_VALID);
      }
      data.id = id;
      const user = await this.userRepository.preload(data);
      const saved = await this.userRepository.save(user);
      return saved;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  /**
   * @param {object}
   * @returns {dataObject}
   * @description : This function is used to check user  already Exist or not with object data
   */
  async find(dataObject: object) {
    try {
      return await this.userRepository.findOne({
        where: dataObject,
      });
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }

  /**
   * @param {object}
   * @returns {}
   * @description : This function is used to check user  already Exist or not with object data
   */
  async findByEmail(email: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .andWhere('user.email = :email', {
          email,
        })
        .getOne();
      return user;
    } catch (err) {
      return this._getInternalServerError(err.message);
    }
  }
  /**
   * @param {object}
   * @returns {dataObject}
   * @description : This function is used to get user by id
   */
  async findById(id: string) {
    try {
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(RESPONSE_MESSAGES.USER.USER_ID_NOT_VALID);
      }
      return await this.userRepository.findOne({
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
   * @description : This function is used to get users data
   */
  async findAll(data: any) {
    try {
      const { search, sort, phone } = data;
      const qr = this.userRepository.createQueryBuilder('user');
      qr.leftJoinAndSelect('user.role', 'role');
      qr.select([
        'user.id',
        'user.name',
        'role.id',
        'role.name',
        'user.email',
        'user.phone',
        'user.status',
      ]);
      if (sort) {
        const param = this.buildSortParams<{
          name: string;
          email: string;
          phone: number;
        }>(sort); //check if param is one of keys
        if (allowedFieldsToSort.includes(param[0])) {
          if (param[0] === 'phone') {
            qr.orderBy(`user.${param[0]}`, param[1]);
          }
          if (param[0] === 'name') {
            qr.orderBy(`user.${param[0]}`, param[1]);
          }
        }
      }
      if (phone) {
        qr.andWhere('user.phone ILIKE :phone', {
          phone: '%' + phone + '%',
        });
      }
      if (search) {
        qr.andWhere(
          'user.name ILIKE :search OR user.phone ILIKE :search OR user.email ILIKE :search',
          {
            search: '%' + search + '%',
          },
        );
      }
      console.log(qr.getSql());
      return await this._paginate<IUser>(qr, {
        limit: data.limit || 10,
        page: data.page || 1,
      });
    } catch (err) {
      this._getInternalServerError(err.message);
    }
  }
}
