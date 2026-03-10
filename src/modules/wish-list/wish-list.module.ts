import { Module } from "@nestjs/common";
import { WishListService } from "./wish-list.service";
import { WishListController } from "./wish-list.controller";
import { ProductModel } from "src/DB/models/product.model";
import { UserModel } from "src/DB/models/user.model";
import { WishListModel } from "src/DB/models/wishList.model";
import { AuthGuard } from "src/common/guards/auth.guard";
import { WishListRepository } from "src/DB/repository/wishList.repository";
import { ProductRepository } from "src/DB/repository/product.Repository";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [ProductModel, UserModel, WishListModel],
  controllers: [WishListController],
  providers: [
    WishListService,
    AuthGuard,
    WishListRepository,
    ProductRepository,
    JwtService,
  ],
})
export class WishListModule {}
