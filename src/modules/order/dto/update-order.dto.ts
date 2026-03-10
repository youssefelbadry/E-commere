import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { orderStatus } from 'lib/IOrder/create-order.interface';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    orderStatus: orderStatus;
}
