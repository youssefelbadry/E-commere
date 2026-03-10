import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
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
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @Roles(Role.USER)
  getProfile(@Req() req: Request) {
    return this.usersService.getProfile(req);
  }

  @Post("profileImage")
  @Roles(Role.USER)
  @UseInterceptors(MulterInterceptor.uploadSingle())
  profileImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.profileImage(req, file);
  }

  @Post("upload-images")
  @Roles(Role.USER)
  @UseInterceptors(MulterInterceptor.uploadMultiple("files", 10))
  uploadImages(@Req() req: any, @UploadedFiles() file: Express.Multer.File) {
    return this.usersService.uploadImages(req, file);
  }
}
