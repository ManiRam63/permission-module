import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithId } from '../abstract';
import { ISidebar } from '../types';
import { Column, Entity, OneToOne } from 'typeorm';
import { Permission } from '../permission/permission.entity';

@Entity()
export class Sidebar extends BaseEntityWithId implements ISidebar {
  @ApiProperty({ description: 'name' })
  @Column({ type: 'varchar', length: 100, default: null })
  name: string;
  @ApiProperty({ description: 'permission id' })
  @OneToOne(() => Permission, (permission) => permission.id, {
    nullable: true,
  })
  permission: string;
  @ApiProperty({ description: 'icon' })
  @Column({ type: 'varchar', length: 100, default: null })
  icon: string;

  @ApiProperty({ description: 'module url' })
  @Column({ type: 'varchar', length: 15, default: null })
  url: string;

  @ApiProperty({ description: 'Module tab slug' })
  @Column({ type: 'varchar', default: true })
  slug: string;

  @ApiProperty({ description: 'Module display order' })
  @Column({ type: 'varchar', default: true })
  displayOrder: number;

  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  status: boolean;
}
