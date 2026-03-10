import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "src/DB/repository/base.repository";
import { UserRepository } from "src/DB/repository/user.reopsitory";
import { HUserDoc, User } from "src/DB/models/user.model";
@Injectable()
export class UsersService {
  constructor(private readonly _userModel: UserRepository) {}
  async getProfile(req: any) {
    const user = req.user;
    return { Message: "Profile Fetched Successfully", data: { user } };
  }

  async profileImage(req: any, file: Express.Multer.File) {
    if (!file) throw new BadRequestException("image not uploaded");

    const image = await this._userModel.findOneAndUpdate({
      filter: { _id: req.user?._id },
      update: {
        $set: { profileImage: file.filename },
      },
      options: { new: true },
    });
    return { Message: "image uploaded successfully", data: { image } };
  }
  async uploadImages(req: any, file: Express.Multer.File) {
    if (!file) throw new BadRequestException("image not uploaded");

    const images = await this._userModel.findOneAndUpdate({
      filter: {
        _id: req.user?._id,
      },
      update: {
        $set: { profileImage: file.filename },
        $inc: { __v: 1 },
      },
      options: { new: true },
    });
    return { Message: "images upload successfully", data: { images } };
  }
}
