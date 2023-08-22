import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ISidebar } from '../types';
export class SidebarDto implements Partial<ISidebar> {
  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'side bar slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'side bar url' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Side bar icon' })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'Side bar display order' })
  @IsNumber()
  displayOrder: number;

  @ApiProperty({ description: 'active' })
  @IsBoolean()
  status: boolean;
}
