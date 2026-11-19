import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './address.dto';
import { AuthGuard } from '@/modules/auth/auth.guard';

@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async list(@Req() req: any) {
    const addresses = await this.addressService.listUserAddresses(req.user.id);
    return { success: true, addresses };
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateAddressDto) {
    const address = await this.addressService.createAddress(req.user.id, dto);
    return { success: true, address };
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto
  ) {
    const address = await this.addressService.updateAddress(req.user.id, id, dto);
    return { success: true, address };
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.addressService.deleteAddress(req.user.id, id);
  }

  @Put(':id/default')
  async setDefault(@Req() req: any, @Param('id') id: string) {
    const address = await this.addressService.setDefault(req.user.id, id);
    return { success: true, address };
  }
}

