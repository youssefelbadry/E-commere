import { IsString, MinLength } from "class-validator";

export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export class FindOneBrandDto {
  @IsString()
  @MinLength(2)
  slug: string;
}
