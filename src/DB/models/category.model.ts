import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import slugify from "slugify";
import { Brand } from "./brand.model";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
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
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  image: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Brand.name,
    default: [],
  })
  brands: Types.ObjectId[];
  
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type HCategoryDoc = HydratedDocument<Category>;

export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: CategorySchema,
  },
]);

CategorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
});
