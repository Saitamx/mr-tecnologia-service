import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../../entities/customer.entity';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterCustomerDto): Promise<{ customer: Partial<Customer>; token: string }> {
    // Verificar si el email ya existe
    const existingCustomer = await this.customersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear cliente
    const customer = this.customersRepository.create({
      fullName: registerDto.fullName,
      email: registerDto.email,
      phone: registerDto.phone,
      password: hashedPassword,
      address: registerDto.address,
      city: registerDto.city,
      region: registerDto.region,
      isActive: true,
    });

    const savedCustomer = await this.customersRepository.save(customer);

    // Generar token
    const payload = { email: savedCustomer.email, sub: savedCustomer.id, type: 'customer' };
    const token = this.jwtService.sign(payload);

    // Actualizar último acceso
    savedCustomer.lastLogin = new Date();
    await this.customersRepository.save(savedCustomer);

    // Retornar sin password
    const { password, ...customerWithoutPassword } = savedCustomer;
    return {
      customer: customerWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginCustomerDto): Promise<{ customer: Partial<Customer>; token: string }> {
    const customer = await this.customersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!customer || !customer.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, customer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const payload = { email: customer.email, sub: customer.id, type: 'customer' };
    const token = this.jwtService.sign(payload);

    // Actualizar último acceso
    customer.lastLogin = new Date();
    await this.customersRepository.save(customer);

    // Retornar sin password
    const { password, ...customerWithoutPassword } = customer;
    return {
      customer: customerWithoutPassword,
      token,
    };
  }

  async findAll(filters?: {
    search?: string;
    isActive?: boolean;
    city?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Customer[]> {
    const query = this.customersRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'orders')
      .orderBy('customer.createdAt', 'DESC');

    if (filters?.search) {
      query.where(
        '(customer.fullName ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.isActive !== undefined) {
      if (filters?.search) {
        query.andWhere('customer.isActive = :isActive', { isActive: filters.isActive });
      } else {
        query.where('customer.isActive = :isActive', { isActive: filters.isActive });
      }
    }

    if (filters?.city) {
      const condition = filters?.search || filters?.isActive !== undefined ? 'andWhere' : 'where';
      query[condition]('customer.city = :city', { city: filters.city });
    }

    if (filters?.region) {
      const condition = filters?.search || filters?.isActive !== undefined || filters?.city ? 'andWhere' : 'where';
      query[condition]('customer.region = :region', { region: filters.region });
    }

    if (filters?.dateFrom && filters?.dateTo) {
      const condition = filters?.search || filters?.isActive !== undefined || filters?.city || filters?.region ? 'andWhere' : 'where';
      query[condition]('customer.createdAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['orders', 'orders.items'],
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customersRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (updateDto.email && updateDto.email !== customer.email) {
      const existingCustomer = await this.findByEmail(updateDto.email);
      if (existingCustomer) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    Object.assign(customer, updateDto);
    return await this.customersRepository.save(customer);
  }

  async updateStatus(id: string, isActive: boolean): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.isActive = isActive;
    return await this.customersRepository.save(customer);
  }

  async getStats() {
    const total = await this.customersRepository.count();
    const active = await this.customersRepository.count({ where: { isActive: true } });
    const inactive = total - active;
    
    const withOrders = await this.customersRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.orders', 'order')
      .select('COUNT(DISTINCT customer.id)', 'count')
      .getRawOne();

    return {
      total,
      active,
      inactive,
      withOrders: parseInt(withOrders?.count || '0'),
    };
  }
}
