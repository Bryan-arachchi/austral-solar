import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  getPaginatedList({ filter, options }: { filter: { [key: string]: any }; options: { [key: string]: any } }) {
    return this.userRepository.getPaginatedList({ filter, options });
  }

  findOne(filter: { [key: string]: any }): Promise<User | null> {
    return this.userRepository.findOne(filter);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.findByIdAndDelete(id);
  }
}
