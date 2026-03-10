import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HUserDoc, User } from "src/DB/models/user.model";
import { Role } from "../enums/user.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDoc>,
    private readonly jwtServer: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await this.jwtServer.verify(token, {
        secret: process.env.ACCESS_TOKEN,
      });

      const user = await this.userModel
        .findById(decoded.id)
        .select("-password");

      if (!user) {
        throw new NotFoundException("User not found");
      }

      request.user = user;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
