import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ICoupon } from "lib/ICoupon/coupon.interface";
import { v4 as uuid } from "uuid";
@Schema({ timestamps: true })
export class Coupon implements ICoupon {
  @Prop({ 
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 20,
 })
  code?: string;

  @Prop({ 
    type: Number,
    min: 0,
    max: 100,
    required: true
 })
  discountPercent: number;

  @Prop({ 
    type: Boolean,
    default: true
 })
  isActive: boolean;

  @Prop({ 
    type: Date,
    required: true
 })
  expiresAt: Date;
  
  @Prop({ 
    type: Number,
    default: 0
 })
  usageCount: number;
  
  @Prop({ 
    type: Number,
    default: 0
 })
  maxUsage: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
export type HCouponDoc = HydratedDocument<Coupon>;

export const CouponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: CouponSchema,
  },
]);

CouponSchema.pre("save" , async function(){
    if(this.isNew){
        this.code = uuid();
    }
})


