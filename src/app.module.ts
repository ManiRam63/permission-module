import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { createTypeOrmProdConfig } from './database';
import { join } from 'path';
import { SidebarModule } from './sidebar/sidebar.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      createTypeOrmProdConfig({
        entities: ['dist/**/*.entity{.ts,.js}'],
        type: 'postgres',
      }),
    ),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
    AuthModule,
    UserModule,
    SidebarModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
