import { IsBoolean, IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/types';

export class UserDto implements Partial<IUser> {
  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Role' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'phone' })
  @IsNumber()
  phone: number;

  @ApiProperty({ description: 'active' })
  @IsBoolean()
  status: boolean;
}
export class FindUserDto implements Partial<IUser> {
  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'email' })
  @IsString()
  email: string;
  @ApiProperty({ description: 'Role' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'phone' })
  @IsNumber()
  phone: number;
}
