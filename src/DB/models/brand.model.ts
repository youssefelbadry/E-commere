import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import slugify from "slugify";

@Schema({
  timestamps: true,
})
export class Brand {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
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
  logo: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export type HBrandDoc = HydratedDocument<Brand>;

export const BrandModel = MongooseModule.forFeature([
  {
    name: Brand.name,
    schema: BrandSchema,
  },
]);

BrandSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
});
