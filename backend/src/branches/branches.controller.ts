import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, ParseFloatPipe, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { userTypes } from 'src/Types/user.types';

@ApiTags('branches')
@Controller({ path: 'branches', version: '1' })
export class BranchesController {
  constructor(
    private readonly branchesService: BranchesService,
    private readonly clsService: ClsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userTypes.ADMIN)
  @ApiBearerAuth()
  @ApiTags('branches')
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiTags('branches')
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
    return this.branchesService.getPaginatedList({
      filter: { search },
      options: { page, limit, pagination, sortBy },
    });
  }
  @Get('nearest')
  @ApiTags('branches')
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number, description: 'Max distance in meters', example: 10000 })
  findNearest(
    @Query('longitude', new ParseFloatPipe()) longitude: number,
    @Query('latitude', new ParseFloatPipe()) latitude: number,
    @Query('maxDistance', new DefaultValuePipe(10000), ParseIntPipe) maxDistance: number,
  ) {
    return this.branchesService.findNearest(longitude, latitude, maxDistance);
  }

  @Get(':id')
  @ApiTags('branches')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userTypes.ADMIN)
  @ApiBearerAuth()
  @ApiTags('branches')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userTypes.ADMIN)
  @ApiBearerAuth()
  @ApiTags('branches')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}
