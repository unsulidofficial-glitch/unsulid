import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  MergeCartDto,
  CalculateCartDto,
} from './cart.dto';
import { OptionalAuthGuard } from '@/modules/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getCart(
    @Req() req: any,
    @Headers('x-session-token') sessionToken?: string
  ) {
    const cart = await this.cartService.getOrCreateCart(
      req.user?.id,
      sessionToken
    );
    const calculated = await this.cartService.calculateTotals(cart.items);
    return {
      success: true,
      cart: {
        id: cart.id,
        sessionToken: cart.sessionToken,
        ...calculated,
      },
    };
  }

  @Post('items')
  @UseGuards(OptionalAuthGuard)
  async addItem(
    @Req() req: any,
    @Headers('x-session-token') sessionToken: string,
    @Body() dto: AddToCartDto
  ) {
    const result = await this.cartService.addItem(
      req.user?.id,
      sessionToken,
      dto.productId,
      dto.quantity
    );
    return { success: true, cart: result };
  }

  @Put('items/:productId')
  @UseGuards(OptionalAuthGuard)
  async updateItem(
    @Req() req: any,
    @Headers('x-session-token') sessionToken: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto
  ) {
    const result = await this.cartService.updateItemQuantity(
      req.user?.id,
      sessionToken,
      productId,
      dto.quantity
    );
    return { success: true, cart: result };
  }

  @Delete('items/:productId')
  @UseGuards(OptionalAuthGuard)
  async removeItem(
    @Req() req: any,
    @Headers('x-session-token') sessionToken: string,
    @Param('productId') productId: string
  ) {
    const result = await this.cartService.removeItem(
      req.user?.id,
      sessionToken,
      productId
    );
    return { success: true, cart: result };
  }

  @Post('merge')
  @UseGuards(OptionalAuthGuard)
  async mergeCart(@Req() req: any, @Body() dto: MergeCartDto) {
    if (!req.user) {
      return { success: false, message: 'Must be logged in to merge cart' };
    }
    const result = await this.cartService.mergeCart(req.user.id, dto.items);
    return { success: true, cart: result };
  }

  @Post('calculate')
  @UseGuards(OptionalAuthGuard)
  async calculate(@Req() req: any, @Body() dto: CalculateCartDto) {
    const result = await this.cartService.calculateTotals(
      dto.items,
      dto.paymentMethod,
      dto.couponCode,
      dto.pinCode,
      req.user?.id
    );
    return { success: true, breakdown: result };
  }
}

