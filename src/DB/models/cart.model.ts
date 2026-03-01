import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { ICart } from "lib/ICart/cart.interface";
import { ICartItem } from "lib/ICart/create.cart.interface";
import { Product } from "./product.model";

@Schema({ timestamps: true })
export class Cart implements ICart {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: Product.name,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  })
  items: ICartItem[];

  @Prop({ default: 0 })
  subTotalPrice: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  shipping: number;
  
  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export type HCartDoc = HydratedDocument<Cart>;

export const CartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: CartSchema,
  },
]);

CartSchema.pre("save", async function () {
  this.subTotalPrice = this.items.reduce((acc, cur) => {
    return acc + cur.price * cur.quantity;
  }, 0);
  this.tax = 0.14;
  this.shipping = this.subTotalPrice ? 100 : 0;
  this.totalPrice = Math.max(0,this.subTotalPrice + this.tax + this.shipping - (this.discount || 0));
});
