import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IOrder } from "lib/IOrder/order.interface";
import {
  IOrderItem,
  orderStatus,
  paymentMethod,
  paymentStatus,
} from "lib/IOrder/create-order.interface";
@Schema({ timestamps: true })
export class Order implements IOrder {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Cart", required: true })
  cartId: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
    ref: "Product",
  })
  items: IOrderItem[];

  @Prop({ type: String, required: false, ref: "Coupon" })
  couponCode?: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  paymentMethod: paymentMethod;

  @Prop({ required: false })
  paymentSessionId?: string;

  @Prop({ required: true })
  orderStatus: orderStatus;

  @Prop({ required: true })
  paymentStatus: paymentStatus;

  @Prop({ required: true })
  subTotalPrice: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ required: true })
  shipping: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  discountPercent: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: false })
  intentId?: string;

  @Prop({ required: false })
  refundId?: string;

  @Prop({ required: false })
  refundAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type HOrderDoc = HydratedDocument<Order>;

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);
