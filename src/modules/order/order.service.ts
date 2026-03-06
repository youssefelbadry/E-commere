import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Cart } from 'src/DB/models/cart.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IOrderItem, orderStatus } from 'lib/IOrder/create-order.interface';
import { Order } from 'src/DB/models/order.model';
import { Product } from 'src/DB/models/product.model';
import { Coupon } from 'src/DB/models/coupon.model';
import { BadRequestException } from '@nestjs/common';
import { CartRepository } from 'src/common/utils/repository/cart.Repository';
import { OrderRepository } from 'src/common/utils/repository/order.Repository';
import { CouponRepository } from 'src/common/utils/repository/coupon.Repository';
import { ProductRepository } from 'src/common/utils/repository/product.Repository';
@Injectable()
export class OrderService {
  constructor(
  private readonly _cartModel: CartRepository,
  private readonly _orderModel : OrderRepository,
  private readonly _couponModel : CouponRepository,
  private readonly _productModel : ProductRepository
  ) {}

//User
async createOrderByUser(createOrderDto: CreateOrderDto, req: any) {

  const cart = await this._cartModel.findOne({
    filter :{
    user: req.user._id,

    }
  });

  if (!cart || !cart.items.length) {
    throw new NotFoundException("Cart not found or empty");
  }

  for (const item of cart.items) {
    const product = await this._productModel.findById({id: item.product});

    if (!product || product.quantity < item.quantity) {
      throw new BadRequestException("Product not available");
    }

    product.quantity -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  const order = await this._orderModel.create({
    data :{
 ...createOrderDto,
    user: new Types.ObjectId(req.user._id),
    cartId: cart._id,
    items: cart.items as [],
    orderStatus: orderStatus.PENDING,
    subTotalPrice: cart.subTotalPrice,
    tax: cart.tax,
    shipping: cart.shipping,
    discount: cart.discount,
    totalPrice: cart.totalPrice,
    couponCode:cart.couponCode ? true : false,
    }
   
  });

  if (cart.couponCode) {
    const coupon = await this._couponModel.findOne({
      filter :{
      code: cart.couponCode,

      }
    });

    if (coupon) {
      coupon.usageCount += 1;

      if (
        coupon.maxUsage > 0 &&
        coupon.usageCount >= coupon.maxUsage
      ) {
        coupon.isActive = false;
      }

      await coupon.save();
    }
  }

  await this._cartModel.findByIdAndUpdate({id:new Types.ObjectId(cart._id).toString(), update: {
    $set: {
      items: [],
      subTotalPrice: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      totalPrice: 0,
      couponCode: null,
    },
  }});
  return {
    message: "Order created successfully",
    data :{order},
  };
}
//User
async findOrdersByUser(req: any) {
    const orders = await this._orderModel.find({filter:{ user: req.user._id} ,
       options :{
        populate:[{
          path :"user",
          select: "firstName lastName email",
        }]
       }
     })
    if(!orders) throw new NotFoundException("Orders not found");
    
    return {message: "Orders found successfully", data: {orders}};
  }
//User
 async findOrderByUser(req: any, id: string) {
    const order = await this._orderModel.findById({id ,select: {user: req.user._id} , options :{
      populate :[{
        path :"user" ,
        select :"firstName lastName email"
      }]
    }})
    if(!order) throw new NotFoundException("Order not found");
    
    return {message: "Order found successfully", data: {order}};
  }
//User
 async cancelOrderByUser(req : any, id: string) {
   const checkOrder = await this._orderModel.findById({id ,select: {user: req.user._id}})
if(!checkOrder) throw new NotFoundException("Order not founded")

if(checkOrder.orderStatus !== orderStatus.PENDING){
    if(checkOrder.orderStatus === orderStatus.DELIVERED){
        throw new BadRequestException("Order is already delivered");
    }else if(checkOrder.orderStatus === orderStatus.SHIPPED){
        throw new BadRequestException("Order is already shipped");
    }else if(checkOrder.orderStatus === orderStatus.CANCELLED){
        throw new BadRequestException("Order is already cancelled");
    }
}

checkOrder.orderStatus = orderStatus.CANCELLED;
await checkOrder.save();

return {message: "Order cancelled successfully", data: {checkOrder}};
  }

  //ADMINS
 async updateOrderForAdmin(id: string, updateOrderDto: UpdateOrderDto) {
const checkCart = await this._cartModel.findOne({filter:{ user :new Types.ObjectId(id)}})
if(!checkCart) throw new NotFoundException("Cart not found");

const checkOrder = await this._orderModel.findOne({filter:{ user :new Types.ObjectId(id)}})
if(!checkOrder) throw new NotFoundException("Order not found");

checkOrder.orderStatus = updateOrderDto.orderStatus;
await checkOrder.save();

return {message: "Order updated successfully", data: {checkOrder}};

  }

  //Admins
  async findOrdersForAdmin() {
    const orders = await this._orderModel.find({options :{
      populate :[
        {
          path : "user",
          select :"firstName lastName email"
        }
      ],
      sort :{createdAt: -1}
    }})
    return {message: "Orders found successfully", data: {orders}};
  }

  //Admins
  async findOrderForAdmin(id: string) {
    const order = await this._orderModel.findById({id ,
      options :{
        populate:[{ path: "user", select : "firstName lastName email" }]
      }
    })
    if(!order) throw new NotFoundException("Order not found");
    
    return {message: "Order found successfully", data: {order}};
  }



}
