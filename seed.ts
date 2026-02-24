import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Product } from './src/entities/product.entity';
import { Category } from './src/entities/category.entity';
import { User, UserRole } from './src/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [Product, Category, User],
  synchronize: false,
  ssl: process.env.DB_HOST?.includes('supabase') ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const categoryRepo = AppDataSource.getRepository(Category);
    const productRepo = AppDataSource.getRepository(Product);
    const userRepo = AppDataSource.getRepository(User);

    // Crear categorías
    console.log('📦 Creating categories...');
    const categories = [
      {
        name: 'Personalizadas',
        slug: 'personalizadas',
        description: 'Carcasas personalizadas para tu dispositivo',
        order: 1,
        isActive: true,
      },
      {
        name: 'JBL',
        slug: 'jbl',
        description: 'Productos y accesorios JBL',
        order: 2,
        isActive: true,
      },
      {
        name: 'Carcasas',
        slug: 'carcasas',
        description: 'Carcasas para smartphones',
        order: 3,
        isActive: true,
      },
      {
        name: 'Otros',
        slug: 'otros',
        description: 'Otros accesorios tecnológicos',
        order: 4,
        isActive: true,
      },
      {
        name: 'Smartwatch',
        slug: 'smartwatch',
        description: 'Relojes inteligentes y accesorios',
        order: 5,
        isActive: true,
      },
      {
        name: 'Samsung',
        slug: 'samsung',
        description: 'Productos y accesorios Samsung',
        order: 6,
        isActive: true,
      },
      {
        name: 'Gamer',
        slug: 'gamer',
        description: 'Accesorios gaming',
        order: 7,
        isActive: true,
      },
    ];

    const savedCategories = [];
    for (const catData of categories) {
      let category = await categoryRepo.findOne({ where: { slug: catData.slug } });
      if (!category) {
        category = categoryRepo.create(catData);
        category = await categoryRepo.save(category);
        console.log(`  ✓ Created category: ${category.name}`);
      } else {
        console.log(`  - Category already exists: ${category.name}`);
      }
      savedCategories.push(category);
    }

    // Crear productos
    console.log('🛍️ Creating products...');
    const products = [
      {
        name: 'Carcasa iPhone 15 Pro Personalizada',
        slug: 'carcasa-iphone-15-pro-personalizada',
        description: 'Carcasa resistente con diseño personalizado para iPhone 15 Pro',
        price: 15000,
        stock: 25,
        isActive: true,
        isFeatured: true,
        categoryId: savedCategories[0].id,
        compatibleModel: 'iPhone 15 Pro',
        color: 'Negro',
      },
      {
        name: 'Carcasa Samsung Galaxy S24 Ultra',
        slug: 'carcasa-samsung-galaxy-s24-ultra',
        description: 'Carcasa de alta protección para Samsung Galaxy S24 Ultra',
        price: 18000,
        stock: 20,
        isActive: true,
        isFeatured: true,
        categoryId: savedCategories[2].id,
        compatibleModel: 'Samsung Galaxy S24 Ultra',
        color: 'Transparente',
      },
      {
        name: 'Auriculares JBL Tune 510BT',
        slug: 'auriculares-jbl-tune-510bt',
        description: 'Auriculares inalámbricos JBL con sonido de calidad',
        price: 45000,
        stock: 15,
        isActive: true,
        isFeatured: true,
        categoryId: savedCategories[1].id,
        compatibleModel: 'Universal',
        color: 'Negro',
      },
      {
        name: 'Carcasa iPhone 14 Pro Max',
        slug: 'carcasa-iphone-14-pro-max',
        description: 'Carcasa resistente para iPhone 14 Pro Max',
        price: 14000,
        stock: 30,
        isActive: true,
        isFeatured: false,
        categoryId: savedCategories[2].id,
        compatibleModel: 'iPhone 14 Pro Max',
        color: 'Azul',
      },
      {
        name: 'Smartwatch Samsung Galaxy Watch 6',
        slug: 'smartwatch-samsung-galaxy-watch-6',
        description: 'Reloj inteligente Samsung con múltiples funciones',
        price: 250000,
        stock: 8,
        isActive: true,
        isFeatured: true,
        categoryId: savedCategories[5].id,
        compatibleModel: 'Universal',
        color: 'Negro',
      },
      {
        name: 'Carcasa Personalizada con Foto',
        slug: 'carcasa-personalizada-con-foto',
        description: 'Carcasa personalizada con tu foto favorita',
        price: 20000,
        stock: 50,
        isActive: true,
        isFeatured: true,
        categoryId: savedCategories[0].id,
        compatibleModel: 'Múltiples modelos',
        color: 'Personalizado',
      },
      {
        name: 'Control Xbox Series X',
        slug: 'control-xbox-series-x',
        description: 'Control inalámbrico para Xbox Series X/S',
        price: 65000,
        stock: 12,
        isActive: true,
        isFeatured: false,
        categoryId: savedCategories[6].id,
        compatibleModel: 'Xbox Series X/S',
        color: 'Negro',
      },
      {
        name: 'Auriculares JBL Quantum 100',
        slug: 'auriculares-jbl-quantum-100',
        description: 'Auriculares gaming JBL con micrófono',
        price: 35000,
        stock: 18,
        isActive: true,
        isFeatured: false,
        categoryId: savedCategories[1].id,
        compatibleModel: 'PC/Consola',
        color: 'Negro/Rojo',
      },
      {
        name: 'Carcasa iPad Pro 12.9"',
        slug: 'carcasa-ipad-pro-12-9',
        description: 'Carcasa con teclado para iPad Pro 12.9"',
        price: 85000,
        stock: 10,
        isActive: true,
        isFeatured: false,
        categoryId: savedCategories[2].id,
        compatibleModel: 'iPad Pro 12.9"',
        color: 'Gris',
      },
      {
        name: 'Smartwatch Apple Watch Series 9',
        slug: 'smartwatch-apple-watch-series-9',
        description: 'Reloj inteligente Apple con GPS y monitor de salud',
        price: 350000,
        stock: 5,
        isActive: true,
        isFeatured: true,
        categoryId: savedCategories[4].id,
        compatibleModel: 'iPhone',
        color: 'Midnight',
      },
      {
        name: 'Cable USB-C Samsung',
        slug: 'cable-usb-c-samsung',
        description: 'Cable USB-C original Samsung de carga rápida',
        price: 8000,
        stock: 40,
        isActive: true,
        isFeatured: false,
        categoryId: savedCategories[5].id,
        compatibleModel: 'Universal',
        color: 'Blanco',
      },
      {
        name: 'Mouse Gaming RGB',
        slug: 'mouse-gaming-rgb',
        description: 'Mouse gaming con iluminación RGB y alta precisión',
        price: 25000,
        stock: 22,
        isActive: true,
        isFeatured: false,
        categoryId: savedCategories[6].id,
        compatibleModel: 'PC',
        color: 'Negro RGB',
      },
    ];

    for (const prodData of products) {
      let product = await productRepo.findOne({ where: { slug: prodData.slug } });
      if (!product) {
        product = productRepo.create(prodData);
        product = await productRepo.save(product);
        console.log(`  ✓ Created product: ${product.name}`);
      } else {
        console.log(`  - Product already exists: ${product.name}`);
      }
    }

    // Crear usuario admin
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('Ecq2357.', 10);
    let admin = await userRepo.findOne({ where: { username: 'admin' } });
    if (!admin) {
      admin = userRepo.create({
        username: 'admin',
        email: 'saitam.developer.001@gmail.com',
        password: adminPassword,
        role: UserRole.ADMIN,
        fullName: 'Administrador',
        isActive: true,
      });
      admin = await userRepo.save(admin);
      console.log('  ✓ Created admin user');
    } else {
      console.log('  - Admin user already exists');
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
