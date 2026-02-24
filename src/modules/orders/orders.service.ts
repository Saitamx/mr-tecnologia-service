import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { WebpayService } from './webpay.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private webpayService: WebpayService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validar productos y stock
    const productIds = createOrderDto.items.map(item => item.productId);
    const products = await this.productsRepository.find({
      where: { id: In(productIds) },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Uno o más productos no existen');
    }

    // Validar stock y calcular totales
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Producto ${item.productId} no encontrado`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Producto ${product.name} no está disponible`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para ${product.name}`);
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: Number(product.price),
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Generar número de orden
    const orderNumber = await this.generateOrderNumber();

    // Crear orden
    const order = this.ordersRepository.create({
      orderNumber,
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      customerPhone: createOrderDto.customerPhone,
      shippingAddress: createOrderDto.shippingAddress,
      subtotal,
      discount: createOrderDto.discount || 0,
      total: subtotal - (createOrderDto.discount || 0),
      paymentMethod: createOrderDto.paymentMethod || 'webpay',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Crear items de la orden
    const savedItems = orderItems.map(item => ({
      ...item,
      orderId: savedOrder.id,
    }));

    await this.orderItemsRepository.save(savedItems);

    // Reducir stock
    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
        await this.productsRepository.save(product);
      }
    }

    // Cargar la orden con items
    return this.findOne(savedOrder.id);
  }

  async findAll(filters?: { status?: OrderStatus; paymentStatus?: PaymentStatus }): Promise<Order[]> {
    const query = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (filters?.status) {
      query.where('order.status = :status', { status: filters.status });
    }

    if (filters?.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: filters.paymentStatus });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { orderNumber },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con número ${orderNumber} no encontrada`);
    }

    return order;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateStatusDto.status;
    
    if (updateStatusDto.paymentStatus) {
      order.paymentStatus = updateStatusDto.paymentStatus;
    }

    return await this.ordersRepository.save(order);
  }

  async initiateWebpayPayment(orderId: string): Promise<{ token: string; url: string }> {
    const order = await this.findOne(orderId);

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      throw new BadRequestException('La orden ya fue procesada');
    }

    const webpayResponse = await this.webpayService.createTransaction({
      amount: order.total,
      buyOrder: order.orderNumber,
      sessionId: order.id,
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/confirm`,
    });

    order.webpayToken = webpayResponse.token;
    await this.ordersRepository.save(order);

    return {
      token: webpayResponse.token,
      url: webpayResponse.url,
    };
  }

  async confirmWebpayPayment(token: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { webpayToken: token },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    const webpayResponse = await this.webpayService.commitTransaction(token);

    if (webpayResponse.responseCode === 0) {
      order.paymentStatus = PaymentStatus.APPROVED;
      order.status = OrderStatus.PAID;
      order.webpayTransactionId = webpayResponse.buyOrder;
    } else {
      order.paymentStatus = PaymentStatus.REJECTED;
      // Restaurar stock si el pago fue rechazado
      for (const item of order.items) {
        const product = await this.productsRepository.findOne({ where: { id: item.productId } });
        if (product) {
          product.stock += item.quantity;
          await this.productsRepository.save(product);
        }
      }
    }

    return await this.ordersRepository.save(order);
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    
    const count = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.createdAt >= :startOfYear', { startOfYear })
      .getCount();

    const sequence = (count + 1).toString().padStart(4, '0');
    return `ORD-${year}-${sequence}`;
  }
}
