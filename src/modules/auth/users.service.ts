import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'username', 'email', 'role', 'fullName', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async resetAdminPassword(): Promise<{ message: string; user: any }> {
    const admin = await this.findByUsername('admin');
    if (!admin) {
      // Crear admin si no existe
      const hashedPassword = await bcrypt.hash('Ecq2357.', 10);
      const newAdmin = this.usersRepository.create({
        username: 'admin',
        email: 'saitam.developer.001@gmail.com',
        password: hashedPassword,
        role: 'admin' as any,
        fullName: 'Administrador',
        isActive: true,
      });
      const saved = await this.usersRepository.save(newAdmin);
      return {
        message: 'Usuario admin creado exitosamente',
        user: {
          username: saved.username,
          email: saved.email,
          role: saved.role,
        },
      };
    } else {
      // Actualizar contraseña del admin existente
      const hashedPassword = await bcrypt.hash('Ecq2357.', 10);
      admin.password = hashedPassword;
      admin.isActive = true;
      await this.usersRepository.save(admin);
      return {
        message: 'Contraseña del admin reseteada exitosamente',
        user: {
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      };
    }
  }
}
