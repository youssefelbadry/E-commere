import { Types } from "mongoose";

export interface ICreateCategory {
  name: string;
  brands?: string[];
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive?: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
