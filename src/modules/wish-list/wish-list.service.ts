import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateWishListDto } from "./dto/create-wish-list.dto";
import { WishListRepository } from "src/DB/repository/wishList.repository";
import { ProductRepository } from "src/DB/repository/product.Repository";
import { Types } from "mongoose";

@Injectable()
export class WishListService {
  constructor(
    private readonly _wishListRepository: WishListRepository,
    private readonly _productRepository: ProductRepository,
  ) {}
  async addProductToWishList(req: any, createWishListDto: CreateWishListDto) {
    const productId = new Types.ObjectId(createWishListDto.product);
    const product = await this._productRepository.findById({
      id: productId,
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    let wishList = await this._wishListRepository.findOne({
      filter: { user: req.user.id },
    });

    if (!wishList) {
      wishList = await this._wishListRepository.create({
        data: {
          user: req.user.id,
          items: [],
          countOfFavorites: 0,
        },
      });
    }

    const productExists = wishList.items.find(
      (item) => item.product.toString() === createWishListDto.product,
    );

    if (productExists) {
      const removeItem = await this._wishListRepository.findByIdAndUpdate({
        id: wishList._id.toString(),
        update: {
          $pull: {
            items: {
              product: productId,
            },
          },
          $inc: {
            countOfFavorites: -1,
          },
        },
        options: {
          new: true,
          populate: [
            {
              path: "items.product",
              select: "name price description image",
            },
          ],
        },
      });
      return {
        message: "Product removed from wishlist",
        updatedWishList: removeItem,
      };
    }

    const updatedWishList = await this._wishListRepository.findByIdAndUpdate({
      id: wishList._id.toString(),
      update: {
        $push: {
          items: {
            product: productId,
          },
        },
        $inc: {
          countOfFavorites: 1,
        },
      },
      options: {
        new: true,
        populate: [
          {
            path: "items.product",
            select: "name price description image",
          },
        ],
      },
    });

    return {
      message: "Product added to wishlist",
      updatedWishList,
    };
  }
  async findAll(req: any) {
    const wishLists = await this._wishListRepository.find({
      filter: { user: req.user.id },
      options: {
        populate: [
          {
            path: "items.product",
            select: "name price description image",
          },
        ],
      },
    });
    if (wishLists.length === 0)
      return {
        message: "No wish lists found",
        wishLists: {
          items: [],
          countOfFavorites: 0,
        },
      };

    return { message: "Wishlist retrieved successfully", wishLists };
  }

  async findOne(req: any, id: string) {
    const wishList = await this._wishListRepository.findOne({
      filter: {
        user: req.user.id,
        "items.product": id,
      },
      options: {
        populate: [
          {
            path: "items.product",
            match: { _id: id },
            select: "name price description image",
          },
        ],
      },
    });
    if (!wishList) throw new NotFoundException("Wish list not found");

    return { message: "Product found in wishlist", wishList };
  }

  async removeProductFromWishList(req: any, id: string) {
    const updatedWishList = await this._wishListRepository.findOneAndUpdate({
      filter: {
        user: req.user.id,
        "items.product": id,
      },
      update: {
        $pull: {
          items: {
            product: id,
          },
        },
        $inc: {
          countOfFavorites: -1,
        },
      },
      options: {
        new: true,
        populate: [
          {
            path: "items.product",
            select: "name price description image",
          },
        ],
      },
    });

    if (!updatedWishList) {
      throw new NotFoundException("Product not found in wishlist");
    }

    return {
      message: "Product removed from wishlist",
      updatedWishList,
    };
  }
}
