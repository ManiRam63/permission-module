import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithId } from '../abstract';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from 'src/role/role.entity';
import { Sidebar } from '../sidebar/sidebar.entity';

@Entity()
export class Permission extends BaseEntityWithId {
  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Sidebar, (sidebar) => sidebar.id)
  @JoinColumn()
  sidebar: Sidebar;
  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  create: boolean;

  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  view: boolean;
  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  update: boolean;
  @ApiProperty({ description: 'read' })
  @Column({ type: 'boolean', default: true })
  read: boolean;
  @ApiProperty({ description: ' delete' })
  @Column({ type: 'boolean', default: true })
  delete: boolean;
}
