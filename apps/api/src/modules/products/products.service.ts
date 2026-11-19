import { Injectable, NotFoundException } from '@nestjs/common';
import { DbStoreService, ProductRecord } from '@/database/db-store.service';

@Injectable()
export class ProductsService {
  constructor(private readonly store: DbStoreService) {}

  async findAll(): Promise<ProductRecord[]> {
    return this.store.products.filter((p) => p.status === 'ACTIVE');
  }

  async findBySlug(slug: string): Promise<ProductRecord> {
    const product = this.store.products.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.status === 'ACTIVE'
    );
    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }
    return product;
  }

  async findById(id: string): Promise<ProductRecord> {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    return product;
  }

  async validateStock(productId: string, requestedQty: number): Promise<boolean> {
    const product = await this.findById(productId);
    if (!product.isPurchasable || product.status !== 'ACTIVE') {
      return false;
    }
    return product.stock >= requestedQty;
  }
}

