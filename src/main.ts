import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });

  const logger = new Logger("Bootstrap");
  const port = process.env.PORT ?? 3000;
  app.use("/uploads", express.static("./src/uploads"));
  app.use("/payments/webhook", express.raw({ type: "application/json" }));
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
  console.log(`Application is running on port ${port}`);
}

bootstrap();
