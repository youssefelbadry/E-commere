import { Module } from "@nestjs/common";
import { BrandsService } from "./brands.service";
import { BrandsController } from "./brands.controller";
import { BrandModel } from "src/DB/models/brand.model";
import { UserModel } from "src/DB/models/user.model";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/common/guards/auth.guard";

@Module({
  imports: [BrandModel, UserModel],
  controllers: [BrandsController],
  providers: [BrandsService, JwtService, AuthGuard],
})
export class BrandsModule {}
