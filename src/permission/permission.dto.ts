import { IsBoolean } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ description: 'create' })
  @IsBoolean()
  create: boolean;
  @ApiProperty({ description: 'view' })
  @IsBoolean()
  view: boolean;
  @ApiProperty({ description: 'update' })
  @IsBoolean()
  update: boolean;
  @ApiProperty({ description: 'read' })
  @IsBoolean()
  read: boolean;
  @ApiProperty({ description: ' delete' })
  @IsBoolean()
  delete: boolean;
}
