import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), ClsModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
