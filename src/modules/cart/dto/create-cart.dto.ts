import { IsNotEmpty, IsNumber, IsMongoId, Min } from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";
import { ICartItem } from "lib/ICart/create.cart.interface";

export class CreateCartDto implements ICartItem {
  @IsMongoId()
  @IsNotEmpty()
  product: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
  
  price: number;
}
