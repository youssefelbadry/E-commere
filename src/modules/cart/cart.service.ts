import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Model, Types } from "mongoose";
import { Category, HCategoryDoc } from "src/DB/models/category.model";
import { InjectModel } from "@nestjs/mongoose";
import { HProductDoc, Product } from "src/DB/models/product.model";
import { Cart, HCartDoc } from "src/DB/models/cart.model";
import { log } from "node:console";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<HCategoryDoc>,
    @InjectModel(Product.name)
    private readonly _productModel: Model<HProductDoc>,
    @InjectModel(Cart.name)
    private readonly _cartModel: Model<HCartDoc>,
  ) {}
   private async checkCart(userId: string) {
    const cart = await this._cartModel.findOne({
      user: userId,
    }).populate("items.product");
    if(!cart)
    return cart;
  }

async addToCart(req: any, dto: CreateCartDto) {

  const product = await this._productModel.findById(dto.product);

  if (!product) {
    throw new NotFoundException("Product not found");
  }

  if (product.quantity < dto.quantity) {
    throw new BadRequestException("Quantity not available");
  }

  let cart = await this._cartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await this._cartModel.create({
      user: req.user._id,
      items: [
        {
          product: product._id.toString(),
          price: product.price,
          quantity: dto.quantity,
        },
      ],
    });

    return { message: "Cart created", data: cart };
  }

  const existingItem = cart.items.find(
    (i) => i.product.toString() === product._id.toString(),
  );

  if (existingItem) {
    existingItem.quantity += dto.quantity;
  } else {
    cart.items.push({
      product: product._id.toString(),
      price: product.price,
      quantity: dto.quantity,
    });
  }

  await cart.save();

  return { message: "Cart updated", data: cart };
}

  async findAll(req: any) {
    const cart = await this.checkCart(req.user._id);
    return {
      message: "Cart found successfully",
      data: cart,
    };
  }

  async findOne(req: any) {
    const cart = await this.checkCart(req.user._id);
    return {
      message: "Cart found successfully",
      data: cart,
    };
  }

async updateQuantity(req: any, updateCartDto: UpdateCartDto) {

  const cart = await this._cartModel.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new NotFoundException("Cart not found");
  }

  const item = cart.items.find(
    (i) => i.product.toString() === updateCartDto.product,
  );

  console.log("item", item?.product);

  if (!item) {
    throw new NotFoundException("Item not found in cart");
  }

  if (updateCartDto.quantity! < 1) {
    throw new BadRequestException("Quantity must be at least 1");
  }

  item.quantity = updateCartDto.quantity!;

  await cart.save(); 

  return {
    message: "Cart updated successfully",
    data: cart,
  };
}

async removeItem(req: any, productId: string) {
  const cart = await this._cartModel.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new NotFoundException("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (i) => i.product.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new NotFoundException("Item not found in cart");
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();

  return {
    message: "Item removed from cart successfully",
    data: cart,
  };
}
 async clearCart(req: any) {
  const cart = await this._cartModel.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new NotFoundException("Cart not found");
  }

  cart.items = [];

  await cart.save();

  return {
    message: "Cart cleared successfully",
    data: cart,
  };
}
}
