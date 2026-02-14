import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { HUserDoc, User } from "src/DB/models/user.model";
import {
  IConfirmEmailDTO,
  ILoginDTO,
  IResetOtpDTO,
  ISignUpDTO,
} from "./dto/createUser.dto";
import { HOtpDoc, Otp } from "src/DB/models/otp.model";
import { generateOtp } from "src/common/utils/email/otp.email";
import { EmailEvent } from "src/common/utils/email/emailSubjectEnum";
import { compareHash } from "src/common/utils/hash/hash.util";
import { emailEvents } from "src/common/utils/events/email.event";
import { randomUUID } from "node:crypto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDoc>,
    @InjectModel(Otp.name) private readonly otpModel: Model<HOtpDoc>,
    private jwtService: JwtService,
  ) {}

  async createOtp(
    userId: Types.ObjectId,
    type: EmailEvent = EmailEvent.ConfirmEmail,
  ) {
    await this.otpModel.create([
      {
        createdBy: userId,
        code: generateOtp(),
        expiredAt: new Date(Date.now() + 2 * 60 * 1000),
        type,
      },
    ]);
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
    }: ISignUpDTO = body;

    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) throw new ConflictException("User already exists");

    const user = await this.userModel.create({
      firstName,
      email,
      lastName,
      password,
      gender,
      phone,
      age,
    });

    if (!user) throw new BadRequestException("SignUp is failed");
    await this.createOtp(user._id);

    return { message: "User created successfully", data: user };
  }

  async resetOtp(body: IResetOtpDTO) {
    const { email, type } = body;

    const checkUser = await this.userModel.findOne({
      email,
    });
    if (!checkUser) throw new NotFoundException("User not found");

    const checkOtp = await this.otpModel.findOne({
      createdBy: checkUser?._id,
      type,
    });

    if (checkOtp?.type === type)
      throw new BadRequestException("Otp already sent");

    await this.createOtp(checkUser._id, type);

    return { message: "Otp sent successfully" };
  }

  async confirmEmail(body: IConfirmEmailDTO) {
    const { email, otp } = body;

    const checkUser = await this.userModel.findOne({
      email,
      isEmailConfirmed: { $exists: false },
    });
    if (!checkUser) throw new NotFoundException("User not found");

    const checkOtp = await this.otpModel.findOne({ createdBy: checkUser?._id });

    if (!(await compareHash(otp as string, checkOtp?.code as string)))
      throw new BadRequestException("Otp is not valid please reset anther otp");

    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: { isEmailConfirmed: new Date() },
        $inc: { __v: 1 },
      },
      { new: true },
    );

    if (!user) throw new BadRequestException("Email is not confirmed");

    return { message: "User Confirm successfully" };
  }
  async login(login: ILoginDTO) {
    const { email, password } = login;
    const user = await this.userModel.findOne({
      email,
      isEmailConfirmed: { $exists: true },
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
}
