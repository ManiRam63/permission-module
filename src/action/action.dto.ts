import { IsBoolean, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAction } from '../types';

export class ActionDto implements Partial<IAction> {
  @ApiProperty({ description: 'Action name', nullable: false })
  @IsString()
  name: string;

  @ApiProperty({ description: 'status', default: true, nullable: true })
  @IsBoolean()
  status: boolean;
}
