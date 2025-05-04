import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  getPaginatedList({ filter, options }: { filter: { [key: string]: any }; options: { [key: string]: any } }) {
    return this.productRepository.getPaginatedList({ filter, options });
  }

  findOne(id: string) {
    return this.productRepository.findById(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.productRepository.findByIdAndDelete(id);
  }

  findMany(ids: string[]) {
    return this.productRepository.findMany({ filter: { _id: { $in: ids } } });
  }
}
