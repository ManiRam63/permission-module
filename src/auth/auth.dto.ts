import { IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/types';

export class AuthDto implements Partial<IUser> {
  @ApiProperty({ description: 'Email' })
  @IsString()
  email: string;
  @ApiProperty({ description: 'Password' })
  @IsNumber()
  password: string;
}
export class resetPasswordAuthDto implements Partial<IUser> {
  @ApiProperty({ description: 'Old password ' })
  @IsString()
  oldPassword: string;
  @ApiProperty({ description: 'new Password' })
  @IsNumber()
  newPassword: string;
}
