import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { createSortObject } from 'src/utils';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private productModel: PaginateModel<Product>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async getPaginatedList({ filter, options }: { filter: { [key: string]: any }; options: { [key: string]: any } }): Promise<PaginateResult<Product>> {
    if (filter.search && filter.search.trim() !== '') {
      filter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { category: { $regex: filter.search, $options: 'i' } },
        { manufacturer: { $regex: filter.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filter.search, 'i')] } },
      ];
    }
    delete filter.search;

    // Remove category from filter if it's undefined
    if (filter.category === undefined) {
      delete filter.category;
    }

    if (options?.sortBy) {
      options.sort = createSortObject(options.sortBy);
    }
    delete options.sortBy;

    return this.productModel.paginate(filter, options);
  }

  findMany({ filter }: { filter: { _id: { $in: string[] } } }) {
    return this.productModel.find(filter);
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async findByIdAndDelete(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
