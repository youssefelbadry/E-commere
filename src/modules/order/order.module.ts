import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderModel } from "src/DB/models/order.model";
import { CartModel } from "src/DB/models/cart.model";
import { ProductModel } from "src/DB/models/product.model";
import { CouponModel } from "src/DB/models/coupon.model";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UserModel } from "src/DB/models/user.model";
import { CartRepository } from "src/common/utils/repository/cart.Repository";
import { OrderRepository } from "src/common/utils/repository/order.Repository";
import { CouponRepository } from "src/common/utils/repository/coupon.Repository";
import { ProductRepository } from "src/common/utils/repository/product.Repository";

@Module({
  imports: [CartModel, OrderModel, ProductModel, CouponModel, UserModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    AuthGuard,
    JwtService,
    CartRepository,
    OrderRepository,
    CouponRepository,
    ProductRepository,
  ],
})
export class OrderModule {}
