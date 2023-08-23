import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
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
import { JwtAuthGuard } from '../auth/jwt.auth.gurd';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
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
  @UseGuards(JwtAuthGuard)
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
  findAll(
    @Query(new YupValidationPipe(getValidationSchema(findValidationSchema)))
    query: FindUserDto,
  ) {
    return this.userService.findAll(query);
  }
  @UseGuards(JwtAuthGuard)
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
  find(
    @Param(
      'id',
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.USER.USER_ID_NOT_VALID }),
    )
    id: string,
  ) {
    return this.userService.findById(id);
  }
}
