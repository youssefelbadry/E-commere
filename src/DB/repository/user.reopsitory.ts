import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HUserDoc, User } from "src/DB/models/user.model";
import { DataBaseRepository } from "./base.repository";

@Injectable()
export class UserRepository extends DataBaseRepository<HUserDoc> {
  constructor(
    @InjectModel(User.name)
    protected readonly model: Model<HUserDoc>,
  ) {
    super(model);
  }
}