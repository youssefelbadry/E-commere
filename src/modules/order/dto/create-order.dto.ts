import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { ICreateOrder, paymentMethod } from "lib/IOrder/create-order.interface";

export class CreateOrderDto implements ICreateOrder {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsEnum(paymentMethod)
  @IsNotEmpty()
  paymentMethod: paymentMethod;
}