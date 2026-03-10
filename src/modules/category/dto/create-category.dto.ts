import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  IsMongoId,
  ArrayNotEmpty,
} from "class-validator";
export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId()
  brands?: string[];
}

export class findCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  slug: string;
}
