import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithId } from '../abstract';
import { IRole } from '../types';
import { Column, Entity, OneToMany, JoinColumn } from 'typeorm';
import { Permission } from 'src/permission/permission.entity';

@Entity()
export class Role extends BaseEntityWithId implements IRole {
  @ApiProperty({ description: 'name' })
  @Column({ type: 'varchar', length: 100, default: null })
  name: string;
  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty({ description: 'permission id' })
  @OneToMany(() => Permission, (permission) => permission.role, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  permission: string;
}
