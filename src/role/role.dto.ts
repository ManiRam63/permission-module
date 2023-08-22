import { IsBoolean, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IRole } from '../types';

export class RoleDto implements Partial<IRole> {
  @ApiProperty({ description: 'role name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'status' })
  @IsBoolean()
  status: boolean;
}
