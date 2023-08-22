import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PermissionService } from '../permission/permission.service';
import { BaseService } from '../abstract';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../auth/auth.constants';
import { RESPONSE_MESSAGES } from 'src/types/responseMessages';
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
        sub: user.id,
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
   *
   * @param user
   * @returns accessToken
   * @description:this function is used to get access token
   */
  async getAccessToken(user) {
    try {
      const accessToken = await this.jwtService.sign(user, {
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
}
