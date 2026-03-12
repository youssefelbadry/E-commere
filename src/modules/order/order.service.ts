import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Cart, HCartDoc } from "src/DB/models/cart.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  IOrderItem,
  orderStatus,
  paymentMethod,
  paymentStatus,
} from "lib/IOrder/create-order.interface";
import { Order } from "src/DB/models/order.model";
import { Product } from "src/DB/models/product.model";
import { Coupon, HCouponDoc } from "src/DB/models/coupon.model";
import { BadRequestException } from "@nestjs/common";
import { CartRepository } from "src/DB/repository/cart.Repository";
import { OrderRepository } from "src/DB/repository/order.Repository";
import { CouponRepository } from "src/DB/repository/coupon.Repository";
import { ProductRepository } from "src/DB/repository/product.Repository";
import { PaymentService } from "src/common/services/payment/payment.service";
import Stripe from "stripe";
import { duration } from "node_modules/zod/v4/core/regexes.cjs";
@Injectable()
export class OrderService {
  constructor(
    private readonly _cartModel: CartRepository,
    private readonly _orderModel: OrderRepository,
    private readonly _couponModel: CouponRepository,
    private readonly _productModel: ProductRepository,
    private readonly _paymentService: PaymentService,
  ) {}

  //User
  async createOrderByUser(createOrderDto: CreateOrderDto, req: any) {
    const cart = await this._cartModel.findOne({
      filter: {
        user: req.user._id,
      },
    });

    if (!cart || !cart.items.length) {
      throw new NotFoundException("Cart not found or empty");
    }

    for (const item of cart.items) {
      const product = await this._productModel.findById({ id: item.product });

      if (!product || product.quantity < item.quantity) {
        throw new BadRequestException("Product not available");
      }

      product.quantity -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const order = await this._orderModel.create({
      data: {
        ...createOrderDto,
        user: new Types.ObjectId(req.user._id),
        cartId: cart._id,
        items: cart.items as [],
        orderStatus: orderStatus.PENDING,
        subTotalPrice: cart.subTotalPrice,
        tax: cart.tax,
        shipping: cart.shipping,
        discount: cart.discount,
        discountPercent: cart.discountPercent,
        totalPrice: cart.totalPrice,
        couponCode: cart.couponCode,
        paymentStatus: paymentStatus.PENDING,
      },
    });

    if (cart.couponCode) {
      const coupon = await this._couponModel.findOne({
        filter: {
          code: cart.couponCode,
        },
      });

      if (coupon) {
        coupon.usageCount += 1;

        if (coupon.maxUsage > 0 && coupon.usageCount >= coupon.maxUsage) {
          coupon.isActive = false;
        }

        await coupon.save();
      }
    }

    await this._cartModel.findByIdAndUpdate({
      id: new Types.ObjectId(cart._id).toString(),
      update: {
        $set: {
          items: [],
          subTotalPrice: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          totalPrice: 0,
          couponCode: null,
        },
      },
    });
    return {
      message: "Order created successfully",
      data: { order },
    };
  }
  //User
  async findOrdersByUser(req: any) {
    const orders = await this._orderModel.find({
      filter: { user: req.user._id },
      options: {
        populate: [
          {
            path: "user",
            select: "firstName lastName email",
          },
        ],
      },
    });
    if (!orders) throw new NotFoundException("Orders not found");

    return { message: "Orders found successfully", data: { orders } };
  }
  //User
  async findOrderByUser(req: any, id: string) {
    const order = await this._orderModel.findById({
      id,
      select: { user: req.user._id },
      options: {
        populate: [
          {
            path: "user",
            select: "firstName lastName email",
          },
        ],
      },
    });
    if (!order) throw new NotFoundException("Order not found");

    return { message: "Order found successfully", data: { order } };
  }
  //User
  async cancelOrderByUser(req: any, id: string) {
    const checkOrder = await this._orderModel.findById({
      id,
      select: { user: req.user._id },
    });
    if (!checkOrder) throw new NotFoundException("Order not founded");

    if (checkOrder.orderStatus !== orderStatus.PENDING) {
      if (checkOrder.orderStatus === orderStatus.DELIVERED) {
        throw new BadRequestException("Order is already delivered");
      } else if (checkOrder.orderStatus === orderStatus.SHIPPED) {
        throw new BadRequestException("Order is already shipped");
      } else if (checkOrder.orderStatus === orderStatus.CANCELLED) {
        throw new BadRequestException("Order is already cancelled");
      }
    }

    checkOrder.orderStatus = orderStatus.CANCELLED;
    await checkOrder.save();

    return { message: "Order cancelled successfully", data: { checkOrder } };
  }

  //ADMINS
  async updateOrderForAdmin(id: string, updateOrderDto: UpdateOrderDto) {
    const checkCart = await this._cartModel.findOne({
      filter: { user: new Types.ObjectId(id) },
    });
    if (!checkCart) throw new NotFoundException("Cart not found");

    const checkOrder = await this._orderModel.findOne({
      filter: { user: new Types.ObjectId(id) },
    });
    if (!checkOrder) throw new NotFoundException("Order not found");

    checkOrder.orderStatus = updateOrderDto.orderStatus;
    await checkOrder.save();

    return { message: "Order updated successfully", data: { checkOrder } };
  }

  //Admins
  async findOrdersForAdmin() {
    const orders = await this._orderModel.find({
      options: {
        populate: [
          {
            path: "user",
            select: "firstName lastName email",
          },
        ],
        sort: { createdAt: -1 },
      },
    });
    return { message: "Orders found successfully", data: { orders } };
  }

  //Admins
  async findOrderForAdmin(id: string) {
    const order = await this._orderModel.findById({
      id,
      options: {
        populate: [{ path: "user", select: "firstName lastName email" }],
      },
    });
    if (!order) throw new NotFoundException("Order not found");

    return { message: "Order found successfully", data: { order } };
  }

  //=============================================
  //PAYMENT
  async createPaymentSession(req: any, orderId: string) {
    const checkOrder = await this._orderModel.findOne({
      filter: {
        _id: new Types.ObjectId(orderId),
        user: req.user._id,
        orderStatus: orderStatus.PENDING,
        paymentMethod: paymentMethod.CREDIT_CARD,
      },
      options: {
        populate: [
          {
            path: "user",
            select: "firstName lastName email",
          },
        ],
      },
    });

    if (!checkOrder) {
      throw new NotFoundException("Order not found");
    }

    const amount = checkOrder.totalPrice ?? checkOrder.subTotalPrice ?? 0;
    if (!amount || amount <= 0) {
      throw new BadRequestException("Invalid order amount");
    }
    const line_items = [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order by ${req.user.username}`,
            description: `Payment for order ${req.user.address || req.user.username}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ];

    const session = await this._paymentService.createCheckoutSession({
      line_items,
      mode: "payment",
      customer_email: req.user.email,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        orderId: checkOrder._id.toString(),
        userId: req.user._id.toString(),
      },
    });
    if (!session) {
      throw new InternalServerErrorException("Payment session not created");
    }

    checkOrder.paymentSessionId = session.id;
    checkOrder.intentId = session.payment_intent as string;
    checkOrder.paymentStatus = paymentStatus.PAID;
    await checkOrder.save();

    return {
      message: "Payment session created successfully",
      url: session.url,
      intentId: session.payment_intent as string,
    };
  }

  async createRefund(orderId: string, req: any) {
    const order = await this._orderModel.findOne({
      filter: {
        _id: new Types.ObjectId(orderId),
        user: req.user._id,
        paymentStatus: paymentStatus.PAID,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!order.intentId) {
      throw new BadRequestException("Order has no payment intent");
    }
    if (order.orderStatus === orderStatus.DELIVERED) {
      throw new BadRequestException("Order is already delivered");
    }
    if (order.orderStatus === orderStatus.SHIPPED) {
      throw new BadRequestException("Order is already shipped");
    }

    const refund = await this._paymentService.createRefund({
      payment_intent: order.intentId,
      amount: order.totalPrice * 100,
    });

    const updatedOrder = await this._orderModel.findByIdAndUpdate({
      id: orderId,
      update: {
        orderStatus: orderStatus.CANCELLED,
        paymentStatus: paymentStatus.REFUNDED,
        refundId: refund.id,
        refundAt: new Date(),
      },
      options: { new: true },
    });

    return {
      message: "Refund created successfully",
      refund,
      order: updatedOrder,
    };
  }

  // async handleStripeWebhook(event: Stripe.Event) {
  //   switch (event.type) {
  //     case "checkout.session.completed": {
  //       const session = event.data.object as Stripe.Checkout.Session;

  //       if (session.payment_status !== "paid") return;

  //       const orderId = session.metadata?.orderId;
  //       const userId = session.metadata?.userId;

  //       if (!orderId || !userId) return;

  //       const order = await this._orderModel.findOne({
  //         filter: {
  //           _id: new Types.ObjectId(orderId),
  //           user: new Types.ObjectId(userId),
  //         },
  //       });

  //       if (!order) return;

  //       if (order.paymentStatus === paymentStatus.PAID) return;

  //       order.paymentStatus = paymentStatus.PAID;
  //       order.orderStatus = orderStatus.PENDING;
  //       order.paymentMethod = paymentMethod.CREDIT_CARD;
  //       order.paymentSessionId = session.id;
  //       order.intentId = session.payment_intent as string;

  //       await order.save();

  //       break;
  //     }

  //     default:
  //       break;
  //   }
  // }
}
