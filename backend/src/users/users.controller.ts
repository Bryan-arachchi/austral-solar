import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore, userTypes } from 'src/Types/user.types';
import { ClsService } from 'nestjs-cls';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clsService: ClsService,
  ) {}

  @Post()
  @ApiTags('users')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiTags('users')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'pagination',
    required: false,
    description: 'Enable pagination',
    example: true,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    example: 'createdAt:desc',
  })
  getPaginatedList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination: boolean = true,
    @Query('sortBy', new DefaultValuePipe('createdAt:desc')) sortBy: string,
    @Query('search', new DefaultValuePipe(undefined))
    search: string | undefined,
  ) {
    return this.usersService.getPaginatedList({
      filter: { search },
      options: { page, limit, pagination, sortBy },
    });
  }

  @Get(':id')
  @ApiTags('users')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiTags('users')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOne({ _id: id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const context = this.clsService.get<AppClsStore>();
    //check if the same user updating their own profile
    if (user._id.toString() !== context.user._id.toString()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userTypes.ADMIN)
  @ApiTags('users')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
