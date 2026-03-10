import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { zodPipe } from "src/common/pipes/zod.pipe";
import * as createUserDto from "./dto/createUser.dto";
import { Role } from "src/common/enums/user.enum";
import { Roles } from "src/common/decorator/role.decorator";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @UsePipes(new zodPipe(createUserDto.signUpSchema))
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post("confirmEmail")
  @UsePipes(new zodPipe(createUserDto.confirmEmailSchema))
  confirmEmail(@Body() body: any) {
    return this.authService.confirmEmail(body);
  }

  @Post("reset-otp")
  @UsePipes(new zodPipe(createUserDto.resetOtpSchema))
  resetOtp(@Body() body: any) {
    return this.authService.resetOtp(body);
  }

  @Post("login")
  @UsePipes(new zodPipe(createUserDto.loginSchema))
  login(@Body() login: any) {
    return this.authService.login(login);
  }

  @Patch("change-password")
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor, responseInterceptor)
  @Roles(Role.USER)
  changePassword(
    @Body(new ValidationPipe()) changePassword: createUserDto.ChangePasswordDTO,
    @Req() req: any,
  ) {
    return this.authService.changePassword(req, changePassword);
  }

  @Patch("change-data")
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor, responseInterceptor)
  @Roles(Role.USER)
  changeData(
    @Body(new ValidationPipe()) changeData: createUserDto.ChangeDataDTO,
    @Req() req: any,
  ) {
    return this.authService.changeData(req, changeData);
  }
}
