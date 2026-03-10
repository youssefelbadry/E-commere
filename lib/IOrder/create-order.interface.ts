import { Types } from "mongoose";

export interface ICreateOrder {
  address: string;
  paymentMethod: paymentMethod;
}
export interface IOrderItem{
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export enum orderStatus{
    PENDING = 'pending',
    SHIPPED ='shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum paymentMethod{
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal',
}   