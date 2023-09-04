import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
/**
 * @description:this is used for permission based which will check via token of login user
 */
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const url = request.url.trim();
    const slug = url.split('/');
    // check if user is exist or not
    // we are consider username as  user email
    if (request?.user) {
      const userRecord: any = await this.userService.findByEmail(
        request?.user?.username,
      );
      return await this.authService.getPermission(
        userRecord,
        slug[1],
        request?.method.toLowerCase(),
      );
    }
    return false;
  }
}
