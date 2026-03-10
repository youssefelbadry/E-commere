import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UserModel } from "src/DB/models/user.model";
import { AuthGuard } from "src/common/guards/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/DB/repository/user.reopsitory";

@Module({
  imports: [UserModel],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, JwtService, UserRepository],
})
export class UsersModule {}
