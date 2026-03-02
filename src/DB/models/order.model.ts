import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IOrder } from "lib/IOrder/order.interface";
import { IOrderItem, orderStatus, paymentMethod } from "lib/IOrder/create-order.interface";
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
  })
  items: IOrderItem[];

  @Prop({type:Boolean,required:false})
  couponCode?: boolean;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  paymentMethod: paymentMethod;

  @Prop({ required: true })
  orderStatus: orderStatus;

  @Prop({ required: true })
  subTotalPrice: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ required: true })
  shipping: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  totalPrice: number;
}


export const OrderSchema = SchemaFactory.createForClass(Order);
export type HOrderDoc = HydratedDocument<Order>;

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);



