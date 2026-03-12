import { Types } from "mongoose";
import {
  ICreateOrder,
  IOrderItem,
  orderStatus,
  paymentMethod,
} from "./create-order.interface";

export interface IOrder extends ICreateOrder {
  user: Types.ObjectId;
  cartId: Types.ObjectId;
  items: IOrderItem[];
  address: string;
  paymentMethod: paymentMethod;
  orderStatus: orderStatus;
  subTotalPrice: number;
  tax: number;
  shipping: number;
  discount: number;
  totalPrice: number;

  couponCode?: string;
}
