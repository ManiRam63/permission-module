import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PermissionService } from '../permission/permission.service';
import { BaseService } from '../abstract';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../auth/auth.constants';
import { RESPONSE_MESSAGES } from 'src/types/responseMessages';
const Actions = Object.freeze({
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  PUT: 'put',
  UPDATE: 'update',
  DELETE: 'delete',
  ADD: 'add',
  VIEW: 'view',
});
@Injectable()
export class AuthService extends BaseService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private permissionService: PermissionService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  /**
   * @param {data}
   * @returns token
   * @description:this function is used to user sign in
   */
  async validateUser(data): Promise<any> {
    try {
      const { email, password } = data;
      const user: any = await this.userService.findByEmail(email);
      const passwordIsValid = await bcrypt.compare(password, user?.password);
      if (!passwordIsValid) {
        this._getBadRequestError(
          RESPONSE_MESSAGES.USER.INVALID_USER_NAME_OR_PASSWORD,
        );
      }
      const payload = {
        uuid: user?.id,
        username: user.email,
      };
      const accessToken = await this.getAccessToken(payload);
      delete user?.password;
      const permission = await this.permissionService.getUserPermissions(user);
      user.permission = permission;
      return {
        access_token: accessToken,
        result: user,
      };
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
  /**
   * @param user
   * @returns accessToken
   * @description:this function is used to get access token
   */
  async getAccessToken(user) {
    try {
      const accessToken = this.jwtService.sign(user, {
        secret: jwtConstants.secret,
        expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      });
      return accessToken;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
  //TODO:we need to update later this one
  /**
   *@description: this function is used to generate refresh token
   */
  //   async getRefreshToken(user) {
  //     const refreshToken = await this.jwtService.sign(user, {
  //       secret: jwtConstants.refreshSecret,
  //       expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  //     });
  //     return refreshToken;
  //   }
  // }

  /**
   * @param {data}
   * @returns token
   * @description:this function is used to user sign in
   */

  async resetPassword(req, data): Promise<any> {
    try {
      if (req) {
        const userDetails = await this.getUserByReq(req);
        const { newPassword, oldPassword } = data;
        const user: any = await this.userService.findById(userDetails?.uuid);
        const passwordIsValid = await bcrypt.compare(
          oldPassword,
          user?.password,
        );
        if (!passwordIsValid) {
          this._getBadRequestError(
            RESPONSE_MESSAGES.USER.INVALID_USER_NAME_OR_PASSWORD,
          );
        }
        const { id } = user;
        //  generate hashed password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        data.password = hashedPassword;
        delete data?.oldPassword;
        delete data?.newPassword;
        await this.userService.update(id, data);
        const mailDetails = {
          from: process.env.SYSTEM_EMAIL,
          to: user?.email,
          subject: 'Reset password',
          html: `<span><b> Your password has been changed </b>.<br> Here is new details of login</br> 
           Your email :${user?.email} <br> Your Password is: ${newPassword}  <br> Please don't share with any one your Details </span>`,
        };
        await this.userService.sendMail(mailDetails);
        return {
          message: 'Your password has been update successfully ',
        };
      } else {
        this.customErrorHandle('Something went wrong');
      }
    } catch (error) {
      this.customErrorHandle(error);
    }
  }
  /**
   *
   * @param req
   * @returns user info
   * @description: this function is used for get user data from jwt token
   */
  async getUserByReq(req: any) {
    try {
      const jwt = await req.headers.authorization.replace('Bearer ', '');
      return this.jwtService.decode(jwt, { json: true }) as {
        uuid: string;
      };
    } catch (error) {
      this.customErrorHandle(error);
    }
  }
  /**
   * @param req
   * @returns user info
   * @description: this function is used for get user data from jwt token
   */
  async getPermission(userDetails, slug, action) {
    try {
      let method = '';
      // we need to match according to request method
      switch (action) {
        case Actions.GET:
          method = Actions.VIEW;
          break;
        case Actions.PATCH:
          method = Actions.UPDATE;
          break;
        case Actions.DELETE:
          method = Actions.DELETE;
          break;
        case Actions.POST:
          method = Actions.ADD;
          break;
        default:
          break;
      }
      const userPermissions =
        await this.permissionService.getUserPermissions(userDetails);
      let returnRes: any = false;

      for (const x of userPermissions) {
        const sidebar = x?.slug;
        const actionList = x?.actions;
        for (const element of actionList) {
          const actionName = element?.name;
          if (sidebar === slug && actionName === method) {
            returnRes = true;
          }
        }
      }
      if (returnRes) {
        return true;
      }
      throw this._getUnauthorized('Permission Denied');
    } catch (error) {
      this.customErrorHandle(error);
    }
  }
}
