import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HUserDoc, User } from "src/DB/models/user.model";
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDoc>,
  ) {}
  async getProfile(req: any) {
    const user = req.user;
    return { Message: "Profile Fetched Successfully", data: { user } };
  }
}
