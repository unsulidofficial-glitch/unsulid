import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DbStoreService, AddressRecord } from '@/database/db-store.service';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import * as crypto from 'crypto';

@Injectable()
export class AddressService {
  constructor(private readonly store: DbStoreService) {}

  async listUserAddresses(userId: string): Promise<AddressRecord[]> {
    return this.store.addresses
      .filter((a) => a.userId === userId)
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }

  async getAddress(userId: string, addressId: string): Promise<AddressRecord> {
    const address = this.store.addresses.find((a) => a.id === addressId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException('Unauthorized access to address');
    }
    return address;
  }

  async createAddress(userId: string, dto: CreateAddressDto): Promise<AddressRecord> {
    const now = new Date();
    const existing = this.store.addresses.filter((a) => a.userId === userId);

    const isFirst = existing.length === 0;
    const isDefault = dto.isDefault ?? isFirst;

    if (isDefault) {
      existing.forEach((a) => (a.isDefault = false));
    }

    const address: AddressRecord = {
      id: 'addr_' + crypto.randomUUID(),
      userId,
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      houseBuilding: dto.houseBuilding.trim(),
      streetLocality: dto.streetLocality.trim(),
      city: dto.city.trim(),
      state: dto.state.trim(),
      pinCode: dto.pinCode.trim(),
      deliveryInstructions: dto.deliveryInstructions?.trim(),
      isDefault,
      createdAt: now,
      updatedAt: now,
    };

    this.store.addresses.push(address);
    return address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto
  ): Promise<AddressRecord> {
    const address = await this.getAddress(userId, addressId);

    if (dto.isDefault) {
      this.store.addresses
        .filter((a) => a.userId === userId && a.id !== addressId)
        .forEach((a) => (a.isDefault = false));
    }

    address.fullName = dto.fullName.trim();
    address.phone = dto.phone.trim();
    address.houseBuilding = dto.houseBuilding.trim();
    address.streetLocality = dto.streetLocality.trim();
    address.city = dto.city.trim();
    address.state = dto.state.trim();
    address.pinCode = dto.pinCode.trim();
    address.deliveryInstructions = dto.deliveryInstructions?.trim();
    if (dto.isDefault !== undefined) {
      address.isDefault = dto.isDefault;
    }
    address.updatedAt = new Date();

    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddress(userId, addressId);
    this.store.addresses = this.store.addresses.filter((a) => a.id !== address.id);
    return { success: true, message: 'Address removed successfully' };
  }

  async setDefault(userId: string, addressId: string): Promise<AddressRecord> {
    const address = await this.getAddress(userId, addressId);
    this.store.addresses
      .filter((a) => a.userId === userId)
      .forEach((a) => (a.isDefault = a.id === addressId));
    address.updatedAt = new Date();
    return address;
  }
}

