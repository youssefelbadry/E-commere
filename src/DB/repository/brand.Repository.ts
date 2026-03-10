    import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand, HBrandDoc } from "src/DB/models/brand.model";
import { DataBaseRepository } from "./base.repository";

@Injectable()
export class BrandRepository extends DataBaseRepository<HBrandDoc> {
  constructor(
    @InjectModel(Brand.name)
    protected readonly model: Model<HBrandDoc>,
  ) {
    super(model);
  }
}