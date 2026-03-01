import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import slugify from "slugify";
import { IProduct } from "lib/Iproducts/interface.product.model";
import { Brand } from "./brand.model";
import { Category } from "./category.model";

@Schema({
  timestamps: true,
})
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    index: true,
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  quantity: number;

  @Prop({
    type: Number,
    default: 0,
  })
  sold: number;

  @Prop({
    type: String,
    required: true,
  })
  imageCover: string;

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Brand.name,
    required: true,
  })
  brand: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type HProductDoc = HydratedDocument<Product>;

export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: ProductSchema,
  },
]);

ProductSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
});
