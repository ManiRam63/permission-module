import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from './role.entity';
import {
  getValidationSchema,
  UuIdValidationPipe,
  YupValidationPipe,
} from '../utils/validation.pipes';
import {
  roleStatusValidationSchema,
  roleValidationSchema,
} from './role.schema';
import { RoleDto } from './role.dto';
import { RoleService } from './role.service';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { PermissionGuard } from 'src/auth/permission.guard';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ROLE.CREATE_ROLE })
  @ApiResponse({
    status: 201,
    description: RESPONSE_MESSAGES.ROLE.CREATE_ROLE,
    type: Role,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.VALIDATION_ERROR,
  })
  async create(
    @Body(new YupValidationPipe(getValidationSchema(roleValidationSchema)))
    data: RoleDto,
  ) {
    return await this.roleService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ROLE.UPDATE_ROLE_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ROLE.UPDATE_ROLE_BY_ID,
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
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.COMMON.VALIDATION_ERROR }),
    )
    id: string,
    @Body(new YupValidationPipe(getValidationSchema(roleValidationSchema)))
    data: Role,
  ) {
    return this.roleService.update(id, data);
  }

  // update status //

  @Post('status/:id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ROLE.UPDATE_ROLE_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ROLE.UPDATE_ROLE_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  updateStatus(
    @Param(
      'id',
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.COMMON.VALIDATION_ERROR }),
    )
    id: string,
    @Body(
      new YupValidationPipe(getValidationSchema(roleStatusValidationSchema)),
    )
    data: Role,
  ) {
    return this.roleService.updateStatus(id, data);
  }
  /**
   * @param query - query params
   * @description:
   */
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/all')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ROLE.UPDATE_ROLE_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ROLE.UPDATE_ROLE_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  findAll(
    @Query()
    query: RoleDto,
  ) {
    return this.roleService.findAll(query);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ROLE.GET_ROLE_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ROLE.GET_ROLE_BY_ID,
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
      new UuIdValidationPipe({
        id: RESPONSE_MESSAGES.ROLE.ROLE_ID_IS_NOT_VALID,
      }),
    )
    id: string,
  ) {
    return this.roleService.findById(id);
  }
  // delete API
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ROLE.DELETE_ROLE })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ROLE.DELETE_ROLE,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
