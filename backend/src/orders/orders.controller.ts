import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, userTypes } from 'src/Types/user.types';

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly clsService: ClsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@Body() createOrderDto: CreateOrderDto) {
    const context = this.clsService.get<AppClsStore>();
    createOrderDto.client = context.user._id.toString();
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'pagination', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  getPaginatedList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe) pagination: boolean,
    @Query('sortBy', new DefaultValuePipe('createdAt:desc')) sortBy: string,
  ) {
    const context = this.clsService.get<AppClsStore>();
    if (context.user.type.includes(userTypes.CLIENT)) {
      return this.ordersService.getPaginatedList({
        filter: { client: context.user._id },
        options: { page, limit, pagination, sortBy },
      });
    }
    return this.ordersService.getPaginatedList({
      options: { page, limit, pagination, sortBy },
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
