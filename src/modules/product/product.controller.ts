import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  Req,
  UseGuards,
  UploadedFile,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "src/common/enums/user.enum";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";
import { CreateBrandDto } from "../brands/dto/create-brand.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor)
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("createProduct")
  @Roles(Role.ADMIN)
  @UseInterceptors(MulterInterceptor.uploadSingle("imageCover"))
  createBrand(
    @Req() req: any,
    @Body(new ValidationPipe()) CreateProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.createProduct(req, CreateProductDto, file);
  }

  @Get("getProducts")
  @Roles(Role.USER)
  findAll() {
    return this.productService.findAllProducts();
  }

  @Get("getProduct/:slug")
  @Roles(Role.USER)
  findOne(@Param("slug") slug: string) {
    return this.productService.findOneProduct(slug);
  }

  @Patch("updateProduct/:id")
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete("deleteProduct/:id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.productService.removeProduct(id);
  }
}
