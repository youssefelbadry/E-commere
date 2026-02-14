import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "src/common/enums/user.enum";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @Roles(Role.USER)
  findOne(@Req() req: Request) {
    return this.usersService.getProfile(req);
  }
}
