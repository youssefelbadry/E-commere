import { Types } from "mongoose";

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageCover: string;
  images?: string[];
  category: Types.ObjectId;
  brand: Types.ObjectId;
}
