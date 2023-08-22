import { IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/types';

export class AuthDto implements Partial<IUser> {
  @ApiProperty({ description: 'Email ' })
  @IsString()
  email: string;
  @ApiProperty({ description: 'Password' })
  @IsNumber()
  password: string;
}
