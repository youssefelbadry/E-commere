import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { WishListService } from "./wish-list.service";
import { CreateWishListDto } from "./dto/create-wish-list.dto";
import { UpdateWishListDto } from "./dto/update-wish-list.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "src/common/enums/user.enum";

@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("wish-list")
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post("addToWishList")
  @Roles(Role.USER)
  create(
    @Body(new ValidationPipe()) createWishListDto: CreateWishListDto,
    @Req() req: any,
  ) {
    return this.wishListService.addProductToWishList(req, createWishListDto);
  }

  @Get("findMyWishList")
  @Roles(Role.USER)
  findAll(@Req() req: any) {
    return this.wishListService.findAll(req);
  }

  @Get("findProductInWishList/:id")
  @Roles(Role.USER)
  findOne(@Param("id") id: string, @Req() req: any) {
    return this.wishListService.findOne(req, id);
  }

  @Delete("removeFromWishList/:id")
  @Roles(Role.USER)
  remove(@Param("id") id: string, @Req() req: any) {
    return this.wishListService.removeProductFromWishList(req, id);
  }
}
