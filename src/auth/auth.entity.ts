import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithId } from 'src/abstract';
import { IRole } from 'src/types';
import { Column, Entity } from 'typeorm';

@Entity()
export class Role extends BaseEntityWithId implements IRole {
  @ApiProperty({ description: 'name' })
  @Column({ type: 'varchar', length: 100, default: null })
  name: string;

  @ApiProperty({ description: 'Is active flag' })
  @Column({ type: 'boolean', default: true })
  status: boolean;
}
