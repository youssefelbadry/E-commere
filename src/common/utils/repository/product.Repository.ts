import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HProductDoc, Product } from "src/DB/models/product.model";
import { DataBaseRepository } from "./base.repository";
import { IProduct } from "lib/Iproducts/interface.product.model";

@Injectable()
export class ProductRepository extends DataBaseRepository<HProductDoc> {
  constructor(
    @InjectModel(Product.name)
    protected readonly model: Model<HProductDoc>,
  ) {
    super(model);
  }
}