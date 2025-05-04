import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from './entities/branch.entity';
import { BranchRepository } from './branches.repository';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]), ClsModule],
  controllers: [BranchesController],
  providers: [BranchesService, BranchRepository],
  exports: [BranchesService],
})
export class BranchesModule {}
