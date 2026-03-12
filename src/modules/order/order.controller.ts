import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  HttpCode,
  Header,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UseInterceptors } from "@nestjs/common";
import { responseInterceptor } from "src/common/interceptors/loger.interceptor";
import { LoggingInterceptor } from "src/common/interceptors/response.interceptor";
import { RolesGuard } from "src/common/guards/roleAuth.guard";
import { Role } from "src/common/enums/user.enum";
import { Roles } from "src/common/decorator/role.decorator";
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor) // for logging and response interceptor
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // User can create order
  @Post("create-order")
  @Roles(Role.USER)
  create(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
    @Req() req: any,
  ) {
    return this.orderService.createOrderByUser(createOrderDto, req);
  }
  // User can get all orders
  @Get("getMyOrders")
  @Roles(Role.USER)
  findAll(@Req() req: any) {
    return this.orderService.findOrdersByUser(req);
  }
  // User can get order by id
  @Get("getMyOrder/:id")
  @Roles(Role.USER)
  findOne(@Param("id") id: string, @Req() req: any) {
    return this.orderService.findOrderByUser(req, id);
  }
  // User can cancel order
  @Patch("cancelOrder/:id")
  @Roles(Role.USER)
  cancelOrder(@Param("id") id: string, @Req() req: any) {
    return this.orderService.cancelOrderByUser(req, id);
  }

  // Admin can get order for admin
  @Get("getOrderForAdmin/:id")
  @Roles(Role.ADMIN)
  findOrderForAdmin(@Param("id") id: string) {
    return this.orderService.findOrderForAdmin(id);
  }

  // Admin can get all orders for admin
  @Get("getOrdersForAdmin")
  @Roles(Role.ADMIN)
  findAllForAdmin() {
    return this.orderService.findOrdersForAdmin();
  }

  // Admin can update order status
  @Patch("updateOrderStatus/:id")
  @Roles(Role.ADMIN)
  updateOrderStatus(
    @Param("id") id: string,
    @Body(new ValidationPipe()) updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderForAdmin(id, updateOrderDto);
  }

  //PAYMENT
  @Post("create-payment-session/:orderId")
  @Roles(Role.USER)
  createPaymentSession(@Param("orderId") orderId: string, @Req() req: any) {
    return this.orderService.createPaymentSession(req, orderId);
  }

  @Post("create-refund/:orderId")
  @Roles(Role.USER)
  createRefund(@Param("orderId") orderId: string, @Req() req: any) {
    return this.orderService.createRefund(orderId, req);
  }

  // @Post("stripe-webhook")
  // @HttpCode(200)
  // @Header("Content-Type", "application/json")
  // @Roles(Role.USER)
  // handleStripeWebhook(@Req() req: any) {
  //   return this.orderService.handleStripeWebhook(req);
  // }
}
