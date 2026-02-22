import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "node:path";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { AuthModule } from "./auth/auth.module";
import { BrandsModule } from './brands/brands.module';
import { CategoryModule } from './category/category.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
