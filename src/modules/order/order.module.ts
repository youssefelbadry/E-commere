import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderModel } from 'src/DB/models/order.model';
import { CartModel } from 'src/DB/models/cart.model';
import { ProductModel } from 'src/DB/models/product.model';
import { CouponModel } from 'src/DB/models/coupon.model';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserModel } from 'src/DB/models/user.model';

@Module({
  imports: [CartModel , OrderModel,ProductModel,CouponModel , UserModel],
  controllers: [OrderController],
  providers: [OrderService , AuthGuard, JwtService],
})
export class OrderModule {}
