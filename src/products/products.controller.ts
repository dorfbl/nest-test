import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, max } from 'rxjs';
import { Product } from './products.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  // @hasRoles(UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
    @Query('orderBy') orderBy?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Observable<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productsService.paginate(
      {
        page: +page,
        limit: +limit,
        route: 'http://192.168.0.10:3000/products',
      },
      orderBy,
      sortOrder,
    );
  }

  @Get('find')
  findWithFilters(
    @Query('name') name: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('store') store: string,
  ) {
    return this.productsService.findWithFilters({
      name,
      store,
      minPrice,
      maxPrice,
    });
  }

  @Get(':id')
  findOne(@Param() params): Observable<any> {
    return this.productsService.findOne(params.id);
  }
}
