import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "node:path";
import { UsersModule } from "./modules/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { BrandsModule } from "./modules/brands/brands.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProductModule } from "./modules/product/product.module";
import { CartModule } from "./modules/cart/cart.module";
import { CouponModule } from "./modules/coupon/coupon.module";
import { OrderModule } from "./modules/order/order.module";
import { WishListModule } from "./modules/wish-list/wish-list.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve("./config/dev.env"),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on("connected", () =>
          console.log("MongoDB connected successfully"),
        );
        return connection;
      },
    }),
    UsersModule,
    AuthModule,
    BrandsModule,
    CategoryModule,
    ProductModule,
    CartModule,
    CouponModule,
    OrderModule,
    WishListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
