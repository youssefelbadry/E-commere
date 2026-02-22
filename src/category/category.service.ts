import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Category, HCategoryDoc } from "src/DB/models/category.model";
import { Model, Types } from "mongoose";
import { FindOneBrandDto } from "src/brands/dto/create-brand.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<HCategoryDoc>,
  ) {}
  async createCategory(
    req: any,
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException("The file is category unique");
    const checkCategory = await this._categoryModel.findOne({
      name: createCategoryDto.name,
      createdBy: req.user?._id as Types.ObjectId,
    });

    if (checkCategory) {
      throw new ConflictException("Category already exists");
    }

    const category = await this._categoryModel.create({
      ...createCategoryDto,
      createdBy: req.user?._id as Types.ObjectId,
      image: file.filename,
    });

    return {
      message: "Category created successfully",
      data: category,
    };
  }

  async findAll() {
    const checkCategory = await this._categoryModel.find({});

    if (checkCategory.length === 0) {
      throw new NotFoundException("Not found category");
    }

    return {
      message: "Category fetched successfully",
      countCategory: checkCategory.length,
      data: checkCategory,
    };
  }

  async findOneCategory(createCategoryDto: FindOneBrandDto) {
    const checkCategory = await this._categoryModel.findOne({
      slug: createCategoryDto.slug,
    });
    if (!checkCategory) throw new NotFoundException("Category not found");

    return {
      message: "Category fetched successfully",
      data: checkCategory,
    };
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const checkCategory = await this._categoryModel.findById(id);
    if (!checkCategory) throw new NotFoundException("Category not founded");

    if (updateCategoryDto.name) {
      checkCategory.name = updateCategoryDto.name;
    }

    if (file) {
      checkCategory.image = file?.filename;
    }

    await checkCategory.save();

    return {
      message: "The category updated successfully",
      data: { checkCategory },
    };
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
