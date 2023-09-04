import { Module, forwardRef } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { Action } from './action.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Action]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
