import { Injectable } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Product } from './products.interface';
import { ProductsEntity } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
  ) {}

  test() {
    return 'string';
  }

  paginate(
    options: IPaginationOptions,
    orderBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Observable<Pagination<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('c');
    if (orderBy) {
      queryBuilder.orderBy(`c.${orderBy}`, sortOrder);
    }

    return from(paginate<Product>(queryBuilder, options)).pipe(
      map((productPaggable: Pagination<Product>) => {
        return productPaggable;
      }),
    );
  }
}
