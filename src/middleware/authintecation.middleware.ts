// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from "@nestjs/common";
// import { Request, Response, NextFunction } from "express";

// @Injectable()
// export class authMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     if (!req.headers.authorization)
//       throw new UnauthorizedException("Missing Invalid Token");
//     next();
//   }
// }
