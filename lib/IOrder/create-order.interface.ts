import { Types } from "mongoose";

export interface ICreateOrder{
    cartId: Types.ObjectId;
    items : IOrderItem[];
    couponCode?: string;
    address: string;
    paymentMethod: paymentMethod;
    orderStatus: orderStatus;
    
  
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