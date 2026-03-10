import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectModel } from "@nestjs/mongoose";
import { HProductDoc, Product } from "src/DB/models/product.model";
import { Model, Types } from "mongoose";
import { ProductRepository } from "src/DB/repository/product.Repository";

@Injectable()
export class ProductService {
  constructor(private readonly _productModel: ProductRepository) {}
  private async checkProduct(id: string) {
    const check = await this._productModel.findById({ id });
    if (!check) throw new NotFoundException("Product not founded");
    return check;
  }
  async createProduct(
    req: any,
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ) {
    // if (!file) {
    //   throw new BadRequestException("The file is product unique");
    // }
    const checkProduct = await this._productModel.findOne({
      filter: {
        name: createProductDto.name,
      },
    });
    if (checkProduct) {
      throw new ConflictException("Product already exists");
    }
    const createProduct = await this._productModel.create({
      data: {
        ...createProductDto,
        name: createProductDto.name,
        imageCover: file?.filename || "",
        createdBy: req.user?._id as Types.ObjectId,
      },
    });
    if (!createProduct)
      throw new BadRequestException("Error in created product");

    return {
      message: "Product created successfully",
      data: { createProduct },
    };
  }

  async findAllProducts() {
    const getProducts = await this._productModel.find({});
    if (getProducts.length === 0)
      throw new NotFoundException("Products not founded");

    return { message: "Products is get", data: { getProducts } };
  }

  async findOneProduct(slug: string) {
    const product = await this._productModel.findOne({ filter: { slug } });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return {
      message: "Product found successfully",
      data: { product },
    };
  }
  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this._productModel.findByIdAndUpdate({
      id,
      update: {
        ...updateProductDto,
      },
      options: {
        new: true,
        runValidators: true,
      },
    });

    if (!updatedProduct) {
      throw new NotFoundException("Product not found");
    }
    return {
      message: "Product updated successfully",
      data: updatedProduct,
    };
  }
  async removeProduct(id: string) {
    await this.checkProduct(id);

    const deletedProduct = await this._productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new BadRequestException("Error deleting product");
    }

    return {
      message: "Product deleted successfully",
      data: deletedProduct,
    };
  }
}
