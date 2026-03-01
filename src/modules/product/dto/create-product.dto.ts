import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
  Min,
  ArrayNotEmpty,
} from "class-validator";

import { Type } from "class-transformer";
import { ICreateProduct } from "lib/Iproducts/createProduct.interface";
import { Types } from "mongoose";

export class CreateProductDto implements ICreateProduct {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  imageCover: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsMongoId()
  category: Types.ObjectId;

  @IsMongoId()
  brand: Types.ObjectId;
}
