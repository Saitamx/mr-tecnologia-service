import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Customer } from '../../entities/customer.entity';
import { OrderItem } from '../../entities/order-item.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async getDashboardStats() {
    // Estadísticas generales
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalCustomers,
      activeCustomers,
      totalOrders,
    ] = await Promise.all([
      this.productsRepository.count(),
      this.productsRepository.count({ where: { isActive: true } }),
      this.categoriesRepository.count(),
      this.customersRepository.count(),
      this.customersRepository.count({ where: { isActive: true } }),
      this.ordersRepository.count(),
    ]);

    // Estadísticas de órdenes
    const ordersByStatus = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const ordersByPaymentStatus = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.paymentStatus', 'paymentStatus')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.paymentStatus')
      .getRawMany();

    // Ventas totales
    const totalSales = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.APPROVED })
      .getRawOne();

    // Ventas del último mes
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const salesLastMonth = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.APPROVED })
      .andWhere('order.createdAt >= :date', { date: lastMonth })
      .getRawOne();

    // Ventas del mes actual
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    const salesCurrentMonth = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.APPROVED })
      .andWhere('order.createdAt >= :date', { date: currentMonthStart })
      .getRawOne();

    // Stock total
    const totalStock = await this.productsRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock)', 'total')
      .where('product.isActive = :active', { active: true })
      .getRawOne();

    return {
      overview: {
        totalProducts,
        activeProducts,
        totalCategories,
        totalCustomers,
        activeCustomers,
        totalOrders,
        totalSales: parseFloat(totalSales?.total || '0'),
        salesLastMonth: parseFloat(salesLastMonth?.total || '0'),
        salesCurrentMonth: parseFloat(salesCurrentMonth?.total || '0'),
        totalStock: parseInt(totalStock?.total || '0'),
      },
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item.status,
        count: parseInt(item.count),
      })),
      ordersByPaymentStatus: ordersByPaymentStatus.map((item) => ({
        paymentStatus: item.paymentStatus,
        count: parseInt(item.count),
      })),
    };
  }

  async getSalesByPeriod(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const sales = await this.ordersRepository
      .createQueryBuilder('order')
      .select("DATE_TRUNC('day', order.createdAt)", 'date')
      .addSelect('SUM(order.total)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.paymentStatus = :status', { status: PaymentStatus.APPROVED })
      .groupBy("DATE_TRUNC('day', order.createdAt)")
      .orderBy("DATE_TRUNC('day', order.createdAt)", 'ASC')
      .getRawMany();

    return sales.map((item) => ({
      date: new Date(item.date).toISOString().split('T')[0],
      total: parseFloat(item.total || '0'),
      count: parseInt(item.count || '0'),
    }));
  }

  async getTopProducts(limit: number = 10) {
    const topProducts = await this.orderItemsRepository
      .createQueryBuilder('item')
      .select('item.productId', 'productId')
      .addSelect('item.productName', 'productName')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('SUM(item.subtotal)', 'totalRevenue')
      .innerJoin('item.order', 'order')
      .where('order.paymentStatus = :status', { status: PaymentStatus.APPROVED })
      .groupBy('item.productId')
      .addGroupBy('item.productName')
      .orderBy('SUM(item.quantity)', 'DESC')
      .limit(limit)
      .getRawMany();

    return topProducts.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      totalQuantity: parseInt(item.totalQuantity || '0'),
      totalRevenue: parseFloat(item.totalRevenue || '0'),
    }));
  }

  async getOrdersByMonth(months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .select("DATE_TRUNC('month', order.createdAt)", 'month')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CASE WHEN order.paymentStatus = :approved THEN order.total ELSE 0 END)', 'revenue')
      .where('order.createdAt >= :startDate', { startDate })
      .setParameter('approved', PaymentStatus.APPROVED)
      .groupBy("DATE_TRUNC('month', order.createdAt)")
      .orderBy("DATE_TRUNC('month', order.createdAt)", 'ASC')
      .getRawMany();

    return orders.map((item) => {
      const date = new Date(item.month);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        month,
        count: parseInt(item.count || '0'),
        revenue: parseFloat(item.revenue || '0'),
      };
    });
  }

  async getCustomersByMonth(months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const customers = await this.customersRepository
      .createQueryBuilder('customer')
      .select("DATE_TRUNC('month', customer.createdAt)", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('customer.createdAt >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('month', customer.createdAt)")
      .orderBy("DATE_TRUNC('month', customer.createdAt)", 'ASC')
      .getRawMany();

    return customers.map((item) => {
      const date = new Date(item.month);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        month,
        count: parseInt(item.count || '0'),
      };
    });
  }
}
