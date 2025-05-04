import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ClsModule } from 'nestjs-cls';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UsersModule, ConfigModule, ClsModule, HttpModule],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, RolesGuard],
  exports: [PassportModule],
})
export class AuthModule {}
