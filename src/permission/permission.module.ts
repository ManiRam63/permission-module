import { Module } from '@nestjs/common';
import { PermissionController } from '../permission/permission.controller';
import { PermissionService } from '../permission/permission.service';
import { Permission } from '../permission/permission.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
