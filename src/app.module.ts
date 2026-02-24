import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get('DB_HOST', 'localhost');
        const isSupabase = dbHost.includes('supabase.co') || dbHost.includes('pooler.supabase.com');
        
        return {
          type: 'postgres',
          host: dbHost,
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'postgres'),
          entities: [Product, Category, User, Order, OrderItem],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
          ssl: isSupabase ? {
            rejectUnauthorized: false,
          } : false,
        };
      },
      inject: [ConfigService],
    }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    OrdersModule,
  ],
})
export class AppModule {}
