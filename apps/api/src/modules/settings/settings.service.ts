import { Injectable } from '@nestjs/common';
import { DbStoreService } from '@/database/db-store.service';

@Injectable()
export class SettingsService {
  constructor(private readonly store: DbStoreService) {}

  getPublicSettings() {
    const s = this.store.settings;
    return {
      storeName: s.storeName,
      storeEmail: s.storeEmail,
      storePhone: s.storePhone,
      currency: s.currency,
      announcementBarMessage: s.announcementBarMessage,
      freeShippingThreshold: s.freeShippingThreshold,
      standardShippingFee: s.standardShippingFee,
      codShippingFee: s.codShippingFee,
      codHandlingFee: s.codHandlingFee,
      codEnabled: s.codEnabled,
      prepaidEnabled: s.prepaidEnabled,
      minCodOrderValue: s.minCodOrderValue,
      maxCodOrderValue: s.maxCodOrderValue,
    };
  }
}

