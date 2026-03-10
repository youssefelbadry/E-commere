import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import type { ZodSchema } from 'zod';

@Injectable()
export class zodPipe implements PipeTransform {
  constructor(private shcema: ZodSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parceValue = this.shcema.parse(value);
      return parceValue;
    } catch (error) {
      throw new BadRequestException('Validation Error');
    }
  }
}
