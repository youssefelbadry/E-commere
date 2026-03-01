import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBrandDto, FindOneBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { HUserDoc, User } from "src/DB/models/user.model";
import { Model, Types } from "mongoose";
import { Brand, HBrandDoc } from "src/DB/models/brand.model";
import { AuthGuard } from "src/common/guards/auth.guard";

@Injectable()
export class BrandsService {
  constructor(
    // @InjectModel(User.name) private readonly _userModel: Model<HUserDoc>,
    @InjectModel(Brand.name) private readonly _brandModel: Model<HBrandDoc>,
  ) {}
  async createBrand(
    req: any,
    createBrandDto: CreateBrandDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Brand logo is required");
    }

    const checkBrand = await this._brandModel.findOne({
      name: createBrandDto.name,
    });

    if (checkBrand) throw new ConflictException("Brand already exists");

    const brand = await this._brandModel.create({
      name: createBrandDto.name,
      logo: file.filename,
      createdBy: req.user?._id as Types.ObjectId,
    });
    if (!brand) throw new BadRequestException("Brand not created");
    return { message: "The brand added successfully", data: { brand } };
  }

  async findAllBrands() {
    const brands = await this._brandModel.find({});

    if (brands.length === 0)
      throw new BadRequestException("Brands not exists") && [];

    return {
      message: "Brands fetched successfully",
      resultCount: brands.length,
      data: { brands },
    };
  }

  async findOneBrand(FindOneBrandDto: FindOneBrandDto) {
    const checkBrand = await this._brandModel.findOne({
      slug: FindOneBrandDto.slug,
    });
    if (!checkBrand) throw new NotFoundException("Brand Not founded");

    return { message: "Brand fetched successfully", data: { checkBrand } };
  }

  async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
    file?: Express.Multer.File,
  ) {
    const checkBrand = await this._brandModel.findById(id);
    if (!checkBrand) throw new NotFoundException("Brand not founded");
    if (updateBrandDto.name) {
      checkBrand.name = updateBrandDto.name;
    }
    if (file) {
      checkBrand.logo = file?.filename;
    }

    await checkBrand.save();

    return { message: "The brand updated successfully", data: { checkBrand } };
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
