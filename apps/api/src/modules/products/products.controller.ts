import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll() {
    const products = await this.productsService.findAll();
    return { success: true, products };
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    return { success: true, product };
  }
}

