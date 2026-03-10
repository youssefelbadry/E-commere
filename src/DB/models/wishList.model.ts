import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { ICartItem } from "lib/ICart/create.cart.interface";
import { Product } from "./product.model";
import { IWishListItem } from "lib/IWishList/create.wishList.interface";
import { IWishList } from "lib/IWishList/wishList.interface";

@Schema({
  timestamps: true,
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
})
export class WishList implements IWishList {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    _id: false,
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: Product.name,
          required: true,
        },
      },
    ],
    default: [],
  })
  items: IWishListItem[];

  @Prop({ default: 0 })
  countOfFavorites: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const WishListSchema = SchemaFactory.createForClass(WishList);
export type HWishListDoc = HydratedDocument<WishList>;

export const WishListModel = MongooseModule.forFeature([
  {
    name: WishList.name,
    schema: WishListSchema,
  },
]);

// WishListSchema.pre("save", async function () {
//   this.subTotalPrice = this.items.reduce((acc, cur) => {
//     return acc + cur.price * cur.quantity;
//   }, 0);
//   this.tax =Math.floor(this.subTotalPrice * 0.14);
//   this.shipping = this.subTotalPrice ? 100 : 0;
//   this.totalPrice = Math.max(0,this.subTotalPrice + this.tax + this.shipping - (this.discount || 0));
// });
