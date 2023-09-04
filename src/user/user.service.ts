import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseService } from '../abstract';
import { IUser } from '../types';
import * as bcrypt from 'bcrypt';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { mailTransporter } from 'src/utils/email.config';
export const allowedFieldsToSort = ['phone', 'status', 'name'];
@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
      //send email to user //
      const mailDetails = {
        from: process.env.SYSTEM_EMAIL,
        to: email,
        subject: 'Login Details',
        html: `<span> Your email :${email} <br> Your Password is: ${password}  <br> Please don't share with any one your Details </span>`,
      };
      await this.sendMail(mailDetails);
      delete saved?.password;
      return saved;
    } catch (error) {
      this.customErrorHandle(error);
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
      this.customErrorHandle(error);
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
      const cacheUser = await this.cacheService.get(`user_${id}`);
      if (cacheUser) {
        return cacheUser;
      }
      const IsExist = await this.find({ id: id });
      if (!IsExist) {
        return this._getNotFoundError(RESPONSE_MESSAGES.USER.USER_ID_NOT_VALID);
      }
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        await this.cacheService.set(`user_${id}`, user);
        const cachedData = await this.cacheService.get(id.toString());
        console.log('data set to cache', cachedData);
      }

      return user;
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
      return await this._paginate<IUser>(qr, {
        limit: data.limit || 10,
        page: data.page || 1,
      });
    } catch (err) {
      this._getInternalServerError(err.message);
    }
  }

  /**
   *
   * @param mailDetails
   * @description :this function is used to send mail to provider
   */
  async sendMail(mailDetails) {
    try {
      mailTransporter.sendMail(mailDetails, function (err) {
        if (err) {
          console.log('Error:Email not Sent!');
        } else {
          console.log('Email sent successfully');
        }
      });
    } catch (error) {
      console.log('Error:Email not Sent!');
    }
  }
}
