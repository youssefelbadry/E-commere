import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HUserDoc, User } from "src/DB/models/user.model";
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<HUserDoc>,
  ) {}
  async getProfile(req: any) {
    const user = req.user;
    return { Message: "Profile Fetched Successfully", data: { user } };
  }

  async profileImage(req: any, file: Express.Multer.File) {
    if (!file) throw new BadRequestException("image not uploaded");

    const image = await this._userModel.findOneAndUpdate(
      { _id: req.user?._id },
      {
        $set: { profileImage: file.filename },
      },
      { new: true },
    );
    return { Message: "image uploaded successfully", data: { image } };
  }
  async uploadImages(req: any, file: Express.Multer.File) {
    if (!file) throw new BadRequestException("image not uploaded");

    const images = await this._userModel.findOneAndUpdate(
      { _id: req.user?._id },
      {
        $set: { profileImage: file.filename },
        $inc: { __v: 1 },
      },
      { new: true },
    );
    return { Message: "images upload successfully", data: { file } };
  }
}
