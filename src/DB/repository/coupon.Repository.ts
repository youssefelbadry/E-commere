import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon, HCouponDoc } from "src/DB/models/coupon.model";
import { Model } from "mongoose";

@Injectable()
export class CouponRepository extends DataBaseRepository<HCouponDoc> {
  constructor(
    @InjectModel(Coupon.name)
    protected readonly model: Model<HCouponDoc>,
  ) {
    super(model);
  }
}