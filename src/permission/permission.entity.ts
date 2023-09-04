import { BaseEntityWithId } from '../abstract';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from 'src/role/role.entity';
import { Sidebar } from '../sidebar/sidebar.entity';
import { Action } from 'src/action/action.entity';

@Entity()
export class Permission extends BaseEntityWithId {
  @ManyToOne(() => Role, (role) => role.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Sidebar, (sidebar) => sidebar.permission, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  sidebar: string;

  @ManyToOne(() => Action, (action) => action.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  action: Action;
}
