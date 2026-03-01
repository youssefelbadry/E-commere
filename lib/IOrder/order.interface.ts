import { ICreateOrder } from "./create-order.interface";

export interface IOrder extends ICreateOrder{
    totalPrice: number;
    subTotalPrice: number;
    discount: number;
    couponCode?: string;
    tax: number;    
}