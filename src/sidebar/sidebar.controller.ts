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
import { Sidebar } from './sidebar.entity';
import {
  getValidationSchema,
  UuIdValidationPipe,
  YupValidationPipe,
} from '../utils/validation.pipes';
import { sidebarValidationSchema } from './sidebar.schema';
import { SidebarDto } from './sidebar.dto';
import { SidebarService } from './sidebar.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RESPONSE_MESSAGES } from '../types/responseMessages';
// @UseGuards(JwtAuthGuard)
@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sideService: SidebarService) {}
  @Post('/')
  @ApiOperation({ summary: 'Create sidebar tab' })
  @ApiResponse({
    status: 201,
    description: 'Create sidebar tab',
    type: Sidebar,
  })
  @ApiResponse({
    status: 500,
    description: RESPONSE_MESSAGES.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 400,
    description: RESPONSE_MESSAGES.COMMON.VALIDATION_ERROR,
  })
  async create(
    @Body(new YupValidationPipe(getValidationSchema(sidebarValidationSchema)))
    data: SidebarDto,
  ) {
    return await this.sideService.create(data);
  }
  // update side bar value
  @Patch(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.SIDEBAR.UPDATE_SIDEBAR_BY_ID })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.SIDEBAR.UPDATE_SIDEBAR_BY_ID,
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
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.SIDEBAR.ID_NOT_VALID }),
    )
    id: string,
    @Body(new YupValidationPipe(getValidationSchema(sidebarValidationSchema)))
    data: Sidebar,
  ) {
    return this.sideService.update(id, data);
  }

  //

  @Get('/all')
  @ApiOperation({ summary: RESPONSE_MESSAGES.SIDEBAR.GET_SIDEBAR_DETAILS })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.SIDEBAR.GET_SIDEBAR_DETAILS,
    type: String,
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
    @Query()
    query: SidebarDto,
  ) {
    return this.sideService.findAll(query);
  }
  //get by id
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: RESPONSE_MESSAGES.SIDEBAR.GET_SIDEBAR_DETAILS })
  @ApiResponse({
    status: 200,
    description: RESPONSE_MESSAGES.SIDEBAR.GET_SIDEBAR_DETAILS,
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
      new UuIdValidationPipe({ id: RESPONSE_MESSAGES.SIDEBAR.ID_NOT_VALID }),
    )
    id: string,
  ) {
    return this.sideService.findById(id);
  }
}
