import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Customer } from '../../entities/customer.entity';
import { OrderItem } from '../../entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Category, Customer, OrderItem]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
