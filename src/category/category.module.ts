import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { CategoryModel } from "src/DB/models/category.model";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UserModel } from "src/DB/models/user.model";

@Module({
  imports: [CategoryModel, UserModel],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService, AuthGuard],
})
export class CategoryModule {}
