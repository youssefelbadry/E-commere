import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Req } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { Role } from "src/common/enums/user.enum";
import { Roles } from "src/common/decorator/role.decorator";
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("createCart")
  @Roles(Role.USER)
  createCart(
    @Body(new ValidationPipe()) createCartDto: CreateCartDto,
    @Req() req: any,
  ) {
    return this.cartService.addToCart(req, createCartDto);
  }

  @Get("getAllCart")
  @Roles(Role.ADMIN)
  findAll(@Req() req: any) {
    return this.cartService.findAll(req);
  }

  @Get("getMyCart")
  @Roles(Role.USER)
  findOne(@Req() req: any) {
    return this.cartService.findOne(req);
  }

  @Patch("updateCart")
  @Roles(Role.USER)
  update(@Req() req: any, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateQuantity(req, updateCartDto);
  }

  @Delete("removeItem/:productId")
  @Roles(Role.USER)
  removeItem(@Req() req: any, @Param("productId") productId: string) {
    return this.cartService.removeItem(req, productId);
  }
  
  @Delete("clearCart")
  @Roles(Role.USER)
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req);
  }
}
