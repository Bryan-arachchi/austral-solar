import { Injectable } from '@nestjs/common';
import { Branch } from './entities/branch.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { createSortObject } from 'src/utils';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchRepository {
  constructor(@InjectModel(Branch.name) private branchModel: PaginateModel<Branch>) {}

  async find({ filter }: { filter: { [key: string]: any } }): Promise<Branch[]> {
    return this.branchModel.find(filter).exec();
  }

  async findById(id: string): Promise<Branch> {
    return this.branchModel.findById(id).exec();
  }

  async getPaginatedList({ filter, options }: { filter: { [key: string]: any }; options: { [key: string]: any } }): Promise<PaginateResult<Branch>> {
    if (filter.search && filter?.search?.trim() !== '') {
      filter.$or = [{ name: { $regex: filter.search, $options: 'i' } }, { locationName: { $regex: filter.search, $options: 'i' } }];
    }
    delete filter.search;

    if (options?.sortBy) {
      options.sort = createSortObject(options.sortBy);
    }
    delete options.sortBy;

    return this.branchModel.paginate(filter, options);
  }

  findOne({ filter }: { [key: string]: any }): Promise<Branch | null> {
    return this.branchModel.findOne(filter).exec();
  }

  create(createBranchDto: CreateBranchDto): Promise<Branch> {
    return new this.branchModel(createBranchDto).save();
  }

  findByIdAndDelete(id: string): Promise<Branch> {
    return this.branchModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch | null> {
    return this.branchModel.findByIdAndUpdate(id, updateBranchDto, { new: true }).exec();
  }

  async findNearest(longitude: number, latitude: number, maxDistance: number): Promise<Branch | null> {
    return this.branchModel
      .findOne({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      })
      .exec();
  }
}
