import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from 'src/DB/models/coupon.model';
import { Cart } from 'src/DB/models/cart.model';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private readonly _couponModel: Model<Coupon>,
@InjectModel(Cart.name) private readonly _cartModel: Model<Cart>) {}
 async createCoupon(createCouponDto: CreateCouponDto) {
    const checkCoupon = await this._couponModel.findOne({code :createCouponDto.code})
    if(checkCoupon) throw new ConflictException("Coupon already exists")

      const coupon = await this._couponModel.create(createCouponDto)
      if(!coupon) throw new BadRequestException("Failed to create coupon")
      return {message :"Coupon created successfully", coupon}
  }

  async findCoupons() {
    const coupons = await this._couponModel.find()
    return { message : "Coupons found", count: coupons.length > 1 ? +coupons.length + " Coupons" : coupons.length === 1 ? "1 Coupon" : "No Coupons", data: {coupons}}
    
  }

  async findCouponByCode(code: string) {
    const coupon = await this._couponModel.findOne({code})
    if(!coupon) throw new BadRequestException("Coupon not found")
    return { message : "Coupon found", data :{coupon} }
  }

  async update(code : string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this._couponModel.findOneAndUpdate({code}, updateCouponDto, {new : true})
    if(!coupon) throw new BadRequestException("Failed to update coupon")
    return { message : "Coupon updated successfully", data :{coupon} }
  }

  async remove(code : string) {
    const coupon = await this._couponModel.findOneAndDelete({code})
    if(!coupon) throw new BadRequestException("Failed to delete coupon")
    return { message : "Coupon deleted successfully", data :{coupon} };
  }

  //==
async applyCoupon(req: any, code: string) {

  const cart = await this._cartModel.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new BadRequestException("Cart not found");
  }

  const coupon = await this._couponModel.findOne({
    code,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!coupon) {
    throw new BadRequestException("Invalid or expired coupon");
  }

  if (coupon.maxUsage > 0 &&
      coupon.usageCount >= coupon.maxUsage) {
    throw new BadRequestException("Coupon usage limit reached");
  }

  cart.discount =
    (cart.subTotalPrice * coupon.discountPercent) / 100;

  await cart.save()

  return {
    message: "Coupon applied successfully",
    discount: cart.discount,
    totalPrice: cart.totalPrice,
  };
}

async clearCoupon(req: any) {
  const cart = await this._cartModel.findOne({
    user: req.user._id,
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
