import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
import { ActionModule } from './action/action.module';
import { JwtStrategy } from './auth/jwt.strategy';
@Module({
  imports: [
    CacheModule.register({
      host: '127.0.0.1',
      port: 6379,
      db: 0,
      ttl: 100000,
    }),
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
    ActionModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
