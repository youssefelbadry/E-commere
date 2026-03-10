import { IsMongoId, IsNotEmpty } from "class-validator";
import { IWishListItem } from "lib/IWishList/create.wishList.interface";

export class CreateWishListDto implements IWishListItem {
  @IsMongoId()
  @IsNotEmpty()
  product: string;
}
