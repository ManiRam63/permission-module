import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Permission } from '../permission/permission.entity';
import {
  getValidationSchema,
  UuIdValidationPipe,
  YupValidationPipe,
} from '../utils/validation.pipes';
import {
  permissionValidationSchema,
  updatePermissionValidationSchema,
} from './permission.schema';
import { PermissionDto } from './permission.dto';
import { PermissionService } from './permission.service';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { PermissionGuard } from 'src/auth/permission.guard';
@UseGuards(JwtAuthGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/')
  @ApiOperation({ summary: RESPONSE_MESSAGES.PERMISSION.CREATE_PERMISSION })
  @ApiResponse({
    status: 201,
    description: RESPONSE_MESSAGES.PERMISSION.CREATE_PERMISSION,
    type: Permission,
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
    @Body(
      new YupValidationPipe(getValidationSchema(permissionValidationSchema)),
    )
    data: PermissionDto,
  ) {
    return await this.permissionService.create(data);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id')
  @ApiOperation({
    summary: RESPONSE_MESSAGES.PERMISSION.UPDATE_PERMISSION_BY_ID,
  })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.PERMISSION.UPDATE_PERMISSION_BY_ID,
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
    @Body(
      new YupValidationPipe(
        getValidationSchema(updatePermissionValidationSchema),
      ),
    )
    data: Permission,
  ) {
    return this.permissionService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.PERMISSION.GET_PERMISSION_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.PERMISSION.GET_PERMISSION_BY_ID,
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
        id: RESPONSE_MESSAGES.PERMISSION.INVALID_PERMISSION_Id,
      }),
    )
    id: string,
  ) {
    return this.permissionService.findById(id);
  }
}
