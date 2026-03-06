import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from 'src/DB/models/product.model';
import { UserModel } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProductRepository } from 'src/common/utils/repository/product.Repository';

@Module({
  imports: [ProductModel, UserModel],
  controllers: [ProductController],
  providers: [ProductService, JwtService, AuthGuard,ProductRepository],
})
export class ProductModule {}
