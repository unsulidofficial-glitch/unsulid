import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DbStoreService } from './db-store.service';

@Global()
@Module({
  providers: [PrismaService, DbStoreService],
  exports: [PrismaService, DbStoreService],
})
export class DatabaseModule {}

