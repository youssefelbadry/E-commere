import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, HCategoryDoc } from "src/DB/models/category.model";
import { DataBaseRepository } from "./base.repository";
@Injectable()
export class CategoryRepository extends DataBaseRepository<HCategoryDoc> {
  constructor(
    @InjectModel(Category.name)
    protected readonly model: Model<HCategoryDoc>,
  ) {
    super(model);
  }
}