import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { ProductModel } from "src/DB/models/product.model";
import { UserModel } from "src/DB/models/user.model";
import { CartModel } from "src/DB/models/cart.model";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CategoryModel } from "src/DB/models/category.model";
import { CouponModel } from "src/DB/models/coupon.model";
import { CartRepository } from "src/common/utils/repository/cart.Repository";
import { ProductRepository } from "src/common/utils/repository/product.Repository";

@Module({
  imports: [CartModel, ProductModel, UserModel, CategoryModel ,CouponModel],
  controllers: [CartController],
  providers: [CartService, JwtService, AuthGuard , CartRepository , ProductRepository],
})
export class CartModule {}
