import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UploadedFile,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { BrandsService } from "./brands.service";
import { CreateBrandDto, FindOneBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "src/common/enums/user.enum";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";
@UseGuards(AuthGuard, RolesGuard)
@Controller("brands")
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post("createBrand")
  @Roles(Role.ADMIN)
  @UseInterceptors(MulterInterceptor.uploadSingle())
  createBrand(
    @Req() req: any,
    @Body(new ValidationPipe()) createBrandDto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandsService.createBrand(req, createBrandDto, file);
  }

  @Get("getBrands")
  @Roles(Role.USER)
  findAllBrands() {
    return this.brandsService.findAllBrands();
  }

  @Get("getOneBrand/:slug")
  @Roles(Role.USER)
  findOneBrand(
    @Param(new ValidationPipe())
    FindOneBrandDto: FindOneBrandDto,
  ) {
    return this.brandsService.findOneBrand(FindOneBrandDto);
  }

  @Patch("updateBrand/:id")
  @Roles(Role.ADMIN)
  @UseInterceptors(MulterInterceptor.uploadSingle())
  updateBrand(
    @Param("id") id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.brandsService.updateBrand(id, updateBrandDto, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.brandsService.remove(+id);
  }
}
