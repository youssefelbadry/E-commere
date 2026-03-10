import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ValidationPipe, Req } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roleAuth.guard';
import { LoggingInterceptor } from 'src/common/interceptors/response.interceptor';
import { responseInterceptor } from 'src/common/interceptors/loger.interceptor';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/user.enum';

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post("createCoupon")
  @Roles(Role.ADMIN)
  create(@Body(new ValidationPipe()) createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }

  @Get("findAllCoupons")
  @Roles(Role.ADMIN)
  findAll() {
    return this.couponService.findCoupons();
  }

  @Get('getCouponByCode/:code')
  @Roles(Role.ADMIN)
  findOne(@Param('code') code: string) {
    return this.couponService.findCouponByCode(code);
  }

  @Patch('updateCoupon/:code')
  @Roles(Role.ADMIN)
  update(@Param('code') code: string, @Body(new ValidationPipe()) updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(code, updateCouponDto);
  }

  @Delete('deleteCoupon/:code')
  @Roles(Role.ADMIN)
  remove(@Param('code') code: string) {
    return this.couponService.remove(code);
  }
  
  @Get('applyCoupon/:code')
  @Roles(Role.USER)
  applyCoupon(@Param('code') code: string, @Req() req: any) {
    return this.couponService.applyCoupon(req , code);
  }

  @Delete('removeCoupon')
  @Roles(Role.USER)
  removeCoupon(@Req() req: any) {
    return this.couponService.clearCoupon(req);
  }
}
