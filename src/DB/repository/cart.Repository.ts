import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, HCartDoc } from "src/DB/models/cart.model";
import { Model } from "mongoose";

@Injectable()
export class CartRepository extends DataBaseRepository<HCartDoc> {
  constructor(
    @InjectModel(Cart.name)
    protected readonly model: Model<HCartDoc>,
  ) {
    super(model);
  }
}