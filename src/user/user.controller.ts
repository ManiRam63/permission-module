import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './user.entity';
import {
  getValidationSchema,
  UuIdValidationPipe,
  YupValidationPipe,
} from '../utils/validation.pipes';
import { findValidationSchema, userValidationSchema } from './user.schema';
import { FindUserDto, UserDto } from './user.dto';
import { UserService } from './user.service';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PermissionGuard } from 'src/auth/permission.guard';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'Create user',
    type: User,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async create(
    @Body(new YupValidationPipe(getValidationSchema(userValidationSchema)))
    data: UserDto,
  ) {
    return await this.userService.create(data);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id')
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
  update(
    @Param(
      'id',
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.USER.USER_ID_NOT_VALID }),
    )
    id: string,
    @Body(new YupValidationPipe(getValidationSchema(userValidationSchema)))
    data: UserDto,
  ) {
    return this.userService.update(id, data);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @CacheTTL(1000)
  @Get('/all')
  @ApiOperation({ summary: RESPONSE_MESSAGES.USER.GET_USER_DETAILS })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.USER.GET_USER_DETAILS,
    type: FindUserDto,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  /**
   * @param query - query params
   * @description:
   */
  async findAll(
    @Query(new YupValidationPipe(getValidationSchema(findValidationSchema)))
    query: FindUserDto,
  ) {
    return await this.userService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('userById')
  @CacheTTL(1000)
  @Get(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.USER.GET_USER_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.USER.GET_USER_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  async find(
    @Param(
      'id',
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.USER.USER_ID_NOT_VALID }),
    )
    id: string,
  ) {
    return await this.userService.findById(id);
  }
}
