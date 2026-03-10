import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import {
  ChangeDataDTO,
  ChangePasswordDTO,
  IConfirmEmailDTO,
  ILoginDTO,
  IResetOtpDTO,
  ISignUpDTO,
} from "./dto/createUser.dto";
import { generateOtp } from "src/common/utils/email/otp.email";
import { EmailEvent } from "src/common/utils/email/emailSubjectEnum";
import { compareHash } from "src/common/utils/hash/hash.util";
import { randomUUID } from "node:crypto";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/DB/repository/user.reopsitory";
import { OtpRepository } from "src/DB/repository/otp.Repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly _userModel: UserRepository,
    private readonly _otpModel: OtpRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createOtp(
    userId: Types.ObjectId,
    type: EmailEvent = EmailEvent.ConfirmEmail,
  ) {
    await this._otpModel.create({
      data: {
        createdBy: userId,
        code: generateOtp(),
        expiredAt: new Date(Date.now() + 2 * 60 * 1000),
        type,
      },
    });
  }

  async signup(body: ISignUpDTO) {
    const {
      firstName,
      email,
      lastName,
      password,
      phone,
      age,
      gender,
      address,
    }: ISignUpDTO = body;

    const checkUser = await this._userModel.findOne({ filter: { email } });
    if (checkUser) throw new ConflictException("User already exists");

    const user = await this._userModel.create({
      data: {
        firstName,
        email,
        lastName,
        password,
        gender,
        phone,
        age,
        address,
      },
    });

    if (!user) throw new BadRequestException("SignUp is failed");
    await this.createOtp(user._id);

    return { message: "User created successfully", data: user };
  }

  async resetOtp(body: IResetOtpDTO) {
    const { email, type } = body;

    const checkUser = await this._userModel.findOne({
      filter: { email },
    });
    if (!checkUser) throw new NotFoundException("User not found");

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser?._id,
        type,
      },
    });

    if (checkOtp?.type === type)
      throw new BadRequestException("Otp already sent");

    await this.createOtp(checkUser._id, type);

    return { message: "Otp sent successfully" };
  }

  async confirmEmail(body: IConfirmEmailDTO) {
    const { email, otp } = body;

    const checkUser = await this._userModel.findOne({
      filter: {
        email,
        isEmailConfirmed: { $exists: false },
      },
    });
    if (!checkUser) throw new NotFoundException("User not found");

    const checkOtp = await this._otpModel.findOne({
      filter: {
        createdBy: checkUser?._id,
      },
    });

    if (!(await compareHash(otp as string, checkOtp?.code as string)))
      throw new BadRequestException("Otp is not valid please reset anther otp");

    const user = await this._userModel.findOneAndUpdate({
      filter: { email },
      update: {
        $set: { isEmailConfirmed: new Date() },
        $inc: { __v: 1 },
      },
      options: { new: true },
    });

    if (!user) throw new BadRequestException("Email is not confirmed");

    return { message: "User Confirm successfully" };
  }
  async login(login: ILoginDTO) {
    const { email, password } = login;
    const user = await this._userModel.findOne({
      filter: {
        email,
        isEmailConfirmed: { $exists: true },
      },
    });
    if (!user) throw new NotFoundException("User not found");

    if (!(await compareHash(password, user.password)))
      throw new BadRequestException("Invalid email or password");

    const jwtId = randomUUID();

    const accessToken = await this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        jwtId,
      },
      {
        secret: process.env.ACCESS_TOKEN,
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRED),
      },
    );

    const refreshToken = await this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,

        jwtId,
      },
      {
        secret: process.env.REFRESH_TOKEN,
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRED),
      },
    );

    return {
      message: "Login successfully",
      credentials: { accessToken, refreshToken },
    };
  }

  async changePassword(req: any, changePasswordDTO: ChangePasswordDTO) {
    const user = await this._userModel.findOne({
      filter: {
        _id: req.user._id,
        email: changePasswordDTO.email,
        isEmailConfirmed: { $exists: true },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }

    const isPasswordCorrect = await compareHash(
      changePasswordDTO.oldPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException("Invalid email or password");
    }

    if (changePasswordDTO.oldPassword === changePasswordDTO.newPassword) {
      throw new BadRequestException(
        "New password cannot be the same as old password",
      );
    }

    user.password = changePasswordDTO.newPassword;

    await user.save();

    return {
      message: "Password updated successfully",
    };
  }

  async changeData(req: any, changeDataDTO: ChangeDataDTO) {
    const user = await this._userModel.findOne({
      filter: {
        _id: req.user._id,
        email: changeDataDTO.email,
        isEmailConfirmed: { $exists: true },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }

    Object.assign(user, changeDataDTO);
    await user.save();

    return {
      message: "Data updated successfully",
      data: user,
    };
  }
}
