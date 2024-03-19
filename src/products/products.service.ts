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

  findOne(id: string): Observable<Product> {
    return from(
      this.productsRepository.findOne({ where: { id: parseInt(id) } }),
    ).pipe(
      map((product: Product) => {
        return product;
      }),
    );
  }

  async findWithFilters(filters: any): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('products');
    if (filters.name) {
      queryBuilder.andWhere('products.product LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.store) {
      queryBuilder.andWhere('products.store LIKE :store', {
        store: `%${filters.store}%`,
      });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('products.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('products.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    return queryBuilder.getMany();
  }
}
