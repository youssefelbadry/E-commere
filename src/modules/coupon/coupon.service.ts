import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from 'src/DB/models/coupon.model';
import { Cart } from 'src/DB/models/cart.model';
import { CouponRepository } from 'src/common/utils/repository/coupon.Repository';
import { CartRepository } from 'src/common/utils/repository/cart.Repository';

@Injectable()
export class CouponService {
  constructor(
private readonly _couponModel: CouponRepository,
private readonly _cartModel: CartRepository
) {}
 async createCoupon(createCouponDto: CreateCouponDto) {
    const checkCoupon = await this._couponModel.findOne({filter:{ code :createCouponDto.code}})
    if(checkCoupon) throw new ConflictException("Coupon already exists")

      const coupon = await this._couponModel.create({data:{ ...createCouponDto}})
      if(!coupon) throw new BadRequestException("Failed to create coupon")
      return {message :"Coupon created successfully", coupon}
  }

  async findCoupons() {
    const coupons = await this._couponModel.find({})
    return { message : "Coupons found", count: coupons.length > 1 ? +coupons.length + " Coupons" : coupons.length === 1 ? "1 Coupon" : "No Coupons", data: {coupons}}
    
  }

  async findCouponByCode(code: string) {
    const coupon = await this._couponModel.findOne({filter:{ code}})
    if(!coupon) throw new BadRequestException("Coupon not found")
    return { message : "Coupon found", data :{coupon} }
  }

  async update(code : string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this._couponModel.findOneAndUpdate({filter:{code}, update: updateCouponDto, options: {new : true}})
    if(!coupon) throw new BadRequestException("Failed to update coupon")
    return { message : "Coupon updated successfully", data :{coupon} }
  }

  async remove(code : string) {
    const coupon = await this._couponModel.findByIdAndDelete(code)
    if(!coupon) throw new BadRequestException("Failed to delete coupon")
    return { message : "Coupon deleted successfully", data :{coupon} };
  }

  //==
async applyCoupon(req: any, code: string) {

  const cart = await this._cartModel.findOne({
    filter :{
    user: req.user._id
  }
  });

  if (!cart || !cart.items.length) {
    throw new BadRequestException("Cart not found or empty");
  }

  const coupon = await this._couponModel.findOne({
    filter:{
      code,
      isActive: true,
      expiresAt: { $gt: new Date() },
    }
  });

  if (!coupon) {
    throw new BadRequestException("Invalid or expired coupon");
  }

  if (
    coupon.maxUsage > 0 &&
    coupon.usageCount >= coupon.maxUsage
  ) {
    throw new BadRequestException("Coupon usage limit reached");
  }

  const subTotal = cart.subTotalPrice;

  cart.discount =
    (subTotal * coupon.discountPercent) / 100;

  cart.couponCode = coupon.code;

  await cart.save();

  return {
    message: "Coupon applied successfully",
    couponCode: cart.couponCode,
    discount: cart.discount,
    totalPrice: cart.totalPrice,
  };
}

async clearCoupon(req: any) {
  const cart = await this._cartModel.findOne({
    filter:{
      user: req.user._id,
    }
  });

  if (!cart) {
    throw new BadRequestException("Cart not found");
  }

  cart.discount = 0;
  await cart.save();

  return {
    message: "Coupon cleared successfully",
    discount: cart.discount,
    totalPrice: cart.totalPrice,
  };
}


}
