import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, findCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { Role } from "src/common/enums/user.enum";
import { Roles } from "src/common/decorator/role.decorator";
import { MulterInterceptor } from "src/common/interceptors/multer.interceptor";
@UseGuards(AuthGuard, RolesGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("createCategory")
  @Roles(Role.ADMIN)
  @UseInterceptors(MulterInterceptor.uploadSingle())
  createCategory(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(req, createCategoryDto, file);
  }

  @Get("getCategories")
  @Roles(Role.ADMIN)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get("getCategory/:slug")
  findOneCategory(
    @Param(new ValidationPipe())
    findCategoryDto: findCategoryDto,
  ) {
    return this.categoryService.findOneCategory(findCategoryDto);
  }

  @Patch("updateCategory/:id")
  @Roles(Role.ADMIN)
  @UseInterceptors(MulterInterceptor.uploadSingle())
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
