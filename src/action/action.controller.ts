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
import {
  getValidationSchema,
  UuIdValidationPipe,
  YupValidationPipe,
} from '../utils/validation.pipes';
import {
  actionStatusValidationSchema,
  actionValidationSchema,
} from './action.schema';
import { ActionDto } from './action.dto';
import { ActionService } from './action.service';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { PermissionGuard } from 'src/auth/permission.guard';
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ACTION.CREATE_ACTION })
  @ApiResponse({
    status: 201,
    description: RESPONSE_MESSAGES.ACTION.CREATE_ACTION,
    type: ActionDto,
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
    @Body(new YupValidationPipe(getValidationSchema(actionValidationSchema)))
    data: ActionDto,
  ) {
    return await this.actionService.create(data);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ACTION.GET_ACTION_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ACTION.GET_ACTION_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  async update(
    @Param(
      'id',
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.COMMON.VALIDATION_ERROR }),
    )
    id: string,
    @Body(new YupValidationPipe(getValidationSchema(actionValidationSchema)))
    data: ActionDto,
  ) {
    return await this.actionService.update(id, data);
  }

  // update status //

  @Post('status/:id')
  @ApiOperation({
    summary: RESPONSE_MESSAGES.ACTION.UPDATE_ACTION_STATUS_BY_ID,
  })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ACTION.UPDATE_ACTION_STATUS_BY_ID,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.NOT_FOUND,
  })
  async updateStatus(
    @Param(
      'id',
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.COMMON.VALIDATION_ERROR }),
    )
    id: string,
    @Body(
      new YupValidationPipe(getValidationSchema(actionStatusValidationSchema)),
    )
    data: ActionDto,
  ) {
    return await this.actionService.updateStatus(id, data);
  }
  /**
   * @param query - query params
   * @description:
   */
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/all')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ACTION.GET_ALL_ACTION })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ACTION.GET_ALL_ACTION,
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
    query: ActionDto,
  ) {
    return this.actionService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.ACTION.GET_ACTION_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.ACTION.GET_ACTION_BY_ID,
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
        id: RESPONSE_MESSAGES.ACTION.INVALID_ACTION_Id,
      }),
    )
    id: string,
  ) {
    return this.actionService.findById(id);
  }
  // delete API
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete actions' })
  @ApiResponse({
    status: 200,
    description: 'Delete actions',
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
    return this.actionService.delete(id);
  }
}
