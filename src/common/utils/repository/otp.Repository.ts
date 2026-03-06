import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HOtpDoc, Otp } from "src/DB/models/otp.model";
import { DataBaseRepository } from "./base.repository";

@Injectable()
export class OtpRepository extends DataBaseRepository<HOtpDoc> {
  constructor(
    @InjectModel(Otp.name)
    protected readonly model: Model<HOtpDoc>,
  ) {
    super(model);
  }
}