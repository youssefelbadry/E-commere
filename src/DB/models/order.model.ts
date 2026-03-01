import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ICoupon } from "lib/ICoupon/coupon.interface";
import { v4 as uuid } from "uuid";
import { IOrder } from "lib/IOrder/order.interface";
import { IOrderItem, orderStatus, paymentMethod } from "lib/IOrder/create-order.interface";
@Schema({ timestamps: true })
export class Order implements IOrder {
    @Prop({
        type: Types.ObjectId,
        ref: "Cart",
        required: true,
    })  
cartId: Types.ObjectId;

@Prop({
    required: true,
})
items : IOrderItem[];

couponCode?: string;

@Prop({
    type: String,
    required: true,
})
address: string;
paymentMethod: paymentMethod;

@Prop({
    type: String,
    required: true,
})
orderStatus: orderStatus;

@Prop({
    type: Number,
    required: true,
})
totalPrice: number;

@Prop({
    type: Number,
    required: true,
})
subTotalPrice: number;

tax: number;

discount: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type HOrderDoc = HydratedDocument<Order>;

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);

OrderSchema.pre("save" , async function(){
   this.tax =  0.14;
   this.discount = this.subTotalPrice * 0.1;
   this.totalPrice = this.subTotalPrice + this.tax - this.discount;
})


