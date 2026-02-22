import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from "@nestjs/mongoose";
import { Document, HydratedDocument, Mongoose } from "mongoose";
import { AuthProvider, Gender, Role } from "src/common/enums/user.enum";

import { generateHash } from "src/common/utils/hash/hash.util";
import { HOtpDoc, Otp } from "./otp.model";

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxLength: 30,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    match: /^[0-9]{10,15}$/,
  })
  phone: string;

  @Prop({
    type: String,
    enum: Gender,
  })
  gender: Gender;

  @Prop({
    type: Number,
    min: 13,
    max: 100,
  })
  age?: number;

  @Prop({
    type: String,
    trim: true,
  })
  profileImage?: string;

  @Prop({
    type: String,
    // select: false,
  })
  password: string;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.SYSTEM,
  })
  provider: AuthProvider;

  @Prop({
    type: String,
  })
  providerId?: string;

  @Prop({
    type: Date,
  })
  isEmailConfirmed: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Virtual()
  otp: HOtpDoc[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type HUserDoc = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
UserSchema.virtual("otp", {
  localField: "_id",
  foreignField: "createdBy",
  ref: Otp.name,
});

UserSchema.virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

UserSchema.pre<HUserDoc>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await generateHash(this.password);
  }
});
