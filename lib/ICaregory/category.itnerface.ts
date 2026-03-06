import { Types } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  createdBy: Types.ObjectId;
  image: string;

  brands: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}