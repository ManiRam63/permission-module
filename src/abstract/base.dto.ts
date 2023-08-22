import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BaseListingDto {
  @ApiProperty({
    description: 'Search',
    required: false,
  })
  @IsString()
  search: string;

  @ApiProperty({ description: 'sort', required: false })
  @IsString()
  sort: string;

  @ApiProperty({ description: 'limit', required: false })
  @IsNumber()
  limit: number;

  @ApiProperty({ description: 'page', required: false })
  @IsNumber()
  page: number;
}
