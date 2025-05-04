import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { createSortObject } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: PaginateModel<User>) {}

  async find({ filter }: { filter: { [key: string]: any } }): Promise<User[]> {
    return this.userModel.find(filter).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async getPaginatedList({ filter, options }: { filter: { [key: string]: any }; options: { [key: string]: any } }): Promise<PaginateResult<User>> {
    //
    if (filter.search && filter?.search?.trim() !== '') {
      filter.$or = [
        { firstName: { $regex: filter.search, $options: 'i' } },
        { lastName: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
      ];
    }
    delete filter.search;
    //
    if (options?.sortBy) {
      options.sort = createSortObject(options.sortBy);
    }
    delete options.sortBy;
    //
    return this.userModel.paginate(filter, options);
  }

  findOne(filter: { [key: string]: any }): Promise<User | null> {
    return this.userModel.findOne(filter).exec();
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save();
  }

  findByIdAndDelete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }
}
