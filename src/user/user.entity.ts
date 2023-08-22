import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithId } from '../abstract';
import { IUser } from 'src/types';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Role } from 'src/role/role.entity';
import * as bcrypt from 'bcrypt';
@Entity()
export class User extends BaseEntityWithId implements IUser {
  @ApiProperty({ description: 'name' })
  @Column({ type: 'varchar', length: 100, default: null })
  name: string;

  @ApiProperty({ description: 'name' })
  @Column({ type: 'varchar', length: 100, default: null })
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @Column({ type: 'varchar', length: 15, default: null })
  phone: number;

  @ApiProperty({ description: 'User Password ' })
  @Column({ type: 'varchar', length: 100, default: null })
  password: string;

  @ApiProperty({ description: 'User role' })
  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  // @ApiProperty({ description: 'refresh token' })
  // @Column({ type: 'varchar', default: null })
  // refreshToken: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @ApiProperty({ description: 'active' })
  @Column({ type: 'boolean', default: true })
  status: boolean;
}
