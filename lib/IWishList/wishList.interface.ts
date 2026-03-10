import { Types } from "mongoose";
import { IWishListItem } from "./create.wishList.interface";

export interface IWishList {
  user: Types.ObjectId;
  items: IWishListItem[];
}
