import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./base.repository";
import { HWishListDoc, WishList } from "../models/wishList.model";

@Injectable()
export class WishListRepository extends DataBaseRepository<HWishListDoc> {
  constructor(
    @InjectModel(WishList.name)
    protected readonly model: Model<HWishListDoc>,
  ) {
    super(model);
  }
}
