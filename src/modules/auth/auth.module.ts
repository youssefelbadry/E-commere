import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModel } from "src/DB/models/user.model";
import { OtpModel } from "src/DB/models/otp.model";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/common/utils/repository/user.reopsitory";
import { OtpRepository } from "src/common/utils/repository/otp.Repository";

@Module({
  imports: [UserModel, OtpModel],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserRepository, OtpRepository],
})
export class AuthModule {
  constructor() {}
}
