import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { BranchRepository } from './branches.repository';

@Injectable()
export class BranchesService {
  constructor(private readonly branchRepository: BranchRepository) {}

  create(createBranchDto: CreateBranchDto) {
    return this.branchRepository.create(createBranchDto);
  }

  getPaginatedList({ filter, options }: { filter: { [key: string]: any }; options: { [key: string]: any } }) {
    return this.branchRepository.getPaginatedList({ filter, options });
  }

  findOne(filter: any): Promise<Branch | null> {
    return this.branchRepository.findOne(filter);
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.branchRepository.update(id, updateBranchDto);
  }

  remove(id: string) {
    return this.branchRepository.findByIdAndDelete(id);
  }
  findNearest(longitude: number, latitude: number, maxDistance: number): Promise<Branch | null> {
    return this.branchRepository.findNearest(longitude, latitude, maxDistance);
  }
}
