import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsDate,
  IsOptional,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { ICreateCoupon } from "lib/ICoupon/create.coupon.interface";

export class CreateCouponDto implements Partial<ICreateCoupon> {

  @IsString()
  @IsOptional()
  @IsUUID()
  code?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent: number;

  @Type(() => Date)
  @IsDate()
  expiresAt: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxUsage?: number;
}