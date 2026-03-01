import { ICreateProduct } from "./createProduct.interface";
import { Types } from "mongoose";

export interface IProduct extends ICreateProduct {
  slug: string;
  sold: number;
  createdBy: Types.ObjectId;
}
