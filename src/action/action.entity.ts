import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithId } from '../abstract';
import { IAction } from '../types';
import { Column, Entity } from 'typeorm';

@Entity()
export class Action extends BaseEntityWithId implements IAction {
  @ApiProperty({ description: 'name' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  status: boolean;
}
