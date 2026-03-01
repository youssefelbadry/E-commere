import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductModel } from "src/DB/models/product.model";
import { UserModel } from "src/DB/models/user.model";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";

@Module({
  imports: [ProductModel, UserModel],
  controllers: [ProductController],
  providers: [ProductService, JwtService, AuthGuard],
})
export class ProductModule {}
