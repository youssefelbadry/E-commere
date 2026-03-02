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
    return this.orderService.create(createOrderDto, req);
  }

@Get()
@Roles(Role.USER)
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
