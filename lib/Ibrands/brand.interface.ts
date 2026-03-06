import { Types } from "mongoose";

export interface IBrand {
  name: string;
  slug: string;
  createdBy: Types.ObjectId;
  logo: string;

  createdAt?: Date;
  updatedAt?: Date;
}