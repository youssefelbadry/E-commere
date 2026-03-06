import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./base.repository";
import { IOrder } from "lib/IOrder/order.interface";
import { InjectModel } from "@nestjs/mongoose";
import { HOrderDoc, Order } from "src/DB/models/order.model";
import { Model } from "mongoose";

@Injectable()
export class OrderRepository extends DataBaseRepository<HOrderDoc> {
  constructor(
    @InjectModel(Order.name)
    protected readonly model: Model<HOrderDoc>,
  ) {
    super(model);
  }
}