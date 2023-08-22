// base.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({ description: 'updated at ' })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  @ApiProperty({ description: 'created at ' })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  @Index()
  createdAt: Date;
}

export abstract class BaseEntityWithId extends BaseEntity {
  @ApiProperty({ description: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
export abstract class BaseEntityWithMeta extends BaseEntityWithId {
  @ApiProperty({ description: 'created by' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  @ApiProperty({ description: 'updated by' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string;
}
