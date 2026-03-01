import { Body, Controller, Patch, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { zodPipe } from "src/common/pipes/zod.pipe";
import {
  confirmEmailSchema,
  loginSchema,
  resetOtpSchema,
  signUpSchema,
} from "./dto/createUser.dto";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @UsePipes(new zodPipe(signUpSchema))
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Patch("confirmEmail")
  @UsePipes(new zodPipe(confirmEmailSchema))
  confirmEmail(@Body() body: any) {
    return this.authService.confirmEmail(body);
  }

  @Post("reset-otp")
  @UsePipes(new zodPipe(resetOtpSchema))
  resetOtp(@Body() body: any) {
    return this.authService.resetOtp(body);
  }

  @Post("login")
  @UsePipes(new zodPipe(loginSchema))
  login(@Body() login: any) {
    return this.authService.login(login);
  }
}
