import { Controller, Body, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import {
  YupValidationPipe,
  getValidationSchema,
} from '../utils/validation.pipes';
import {
  authValidationSchema,
  resetPasswordValidationSchema,
} from './auth.schema';
import { JwtAuthGuard } from './jwt.auth.guard';
import { PermissionGuard } from './permission.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signIn')
  @ApiOperation({ summary: RESPONSE_MESSAGES.USER.UPDATE_USER_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.USER.UPDATE_USER_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  async signIn(
    @Body(new YupValidationPipe(getValidationSchema(authValidationSchema)))
    data: AuthDto,
  ) {
    return this.authService.validateUser(data);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/reset-password')
  @ApiOperation({ summary: RESPONSE_MESSAGES.USER.UPDATE_USER_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.USER.UPDATE_USER_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  async resetPassword(
    @Request() req: any,
    @Body(
      new YupValidationPipe(getValidationSchema(resetPasswordValidationSchema)),
    )
    data: AuthDto,
  ) {
    return this.authService.resetPassword(req, data);
  }
}
