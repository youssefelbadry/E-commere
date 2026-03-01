import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { UserModel } from 'src/DB/models/user.model';
import { CartModel } from 'src/DB/models/cart.model';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CouponModel } from 'src/DB/models/coupon.model';

@Module({
  imports: [CartModel, UserModel , CouponModel],
  controllers: [CouponController],
  providers: [CouponService , AuthGuard , JwtService],
})
export class CouponModule {}
