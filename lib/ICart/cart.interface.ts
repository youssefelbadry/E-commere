import { Types } from "mongoose";
import { ICartItem } from "./create.cart.interface";

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  subTotalPrice: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
