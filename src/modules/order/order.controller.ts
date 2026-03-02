import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UseInterceptors } from '@nestjs/common';
import { responseInterceptor } from 'src/common/interceptors/loger.interceptor';
import { LoggingInterceptor } from 'src/common/interceptors/response.interceptor';
import { RolesGuard } from 'src/common/guards/roleAuth.guard';
import { Role } from 'src/common/enums/user.enum';
import { Roles } from 'src/common/decorator/role.decorator';
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, responseInterceptor) // for logging and response interceptor   
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

@Post("create-order") 
@Roles(Role.USER)
  create(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto,@Req() req: any) {
    return this.orderService.createOrderByUser(createOrderDto, req);
  }

@Get("getMyOrders")
@Roles(Role.USER)
  findAll(@Req() req: any) {
    return this.orderService.findOrdersByUser(req);
  }

  @Get('getMyOrder/:id')
  @Roles(Role.USER)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.orderService.findOrderByUser(req, id);
  }
  
  @Get('cancelOrder/:id')
  @Roles(Role.USER)
  cancelOrder(@Param('id') id: string, @Req() req: any) {
    return this.orderService.cancelOrderByUser(req, id);
  }
    @Get('getOrderForAdmin/:id')
      @Roles(Role.ADMIN)
      findOrderForAdmin(@Param('id') id: string) {
        return this.orderService.findOrderForAdmin(id);
  }

@Get("getOrdersForAdmin")
@Roles(Role.ADMIN)
  findAllForAdmin() {
    return this.orderService.findOrdersForAdmin();
  }


  @Patch('updateOrderStatus/:id')
  @Roles(Role.ADMIN)
  updateOrderStatus(@Param('id') id: string, @Body(new ValidationPipe()) updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrderForAdmin(id, updateOrderDto);
  }


}

