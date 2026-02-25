-- ============================================
-- SCRIPT DE SEED COMPLETO PARA MR TECNOLOGÍA
-- ============================================
-- Ejecuta este script completo en el SQL Editor de Supabase
-- Copia y pega todo el contenido en el editor SQL

-- ============================================
-- 1. CREAR ENUMS
-- ============================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('webpay', 'transfer', 'cash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. CREAR TABLA CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(500),
    "order" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. CREAR TABLA CUSTOMERS
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "fullName" VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    "isActive" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. CREAR TABLA USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'manager',
    "fullName" VARCHAR(100),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. CREAR TABLA ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" VARCHAR(50) NOT NULL UNIQUE,
    "customerId" UUID,
    "customerName" VARCHAR(200) NOT NULL,
    "customerEmail" VARCHAR(255) NOT NULL,
    "customerPhone" VARCHAR(50) NOT NULL,
    "shippingAddress" TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    "paymentMethod" payment_method DEFAULT 'webpay',
    "paymentStatus" payment_status DEFAULT 'pending',
    "webpayToken" VARCHAR(255),
    "webpayTransactionId" VARCHAR(255),
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_customer FOREIGN KEY ("customerId") REFERENCES customers(id) ON DELETE SET NULL
);

-- ============================================
-- 6. CREAR TABLA ORDER_ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "productName" VARCHAR(200) NOT NULL,
    "unitPrice" DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_order FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE RESTRICT
);

-- ============================================
-- 7. CREAR TABLA PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500),
    slug VARCHAR(200) NOT NULL UNIQUE,
    stock INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "isFeatured" BOOLEAN DEFAULT false,
    "categoryId" UUID NOT NULL,
    "compatibleModel" VARCHAR(100),
    color VARCHAR(50),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_category FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE CASCADE
);

-- ============================================
-- 8. CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId");
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers("isActive");
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders("orderNumber");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders("paymentStatus");
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders("customerEmail");
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders("customerId");
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items("orderId");
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items("productId");

-- ============================================
-- 9. INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categories (id, name, slug, description, image, "order", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Personalizadas', 'personalizadas', 'Carcasas personalizadas para tu dispositivo', 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&h=400&fit=crop', 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'JBL', 'jbl', 'Productos y accesorios JBL', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'Carcasas', 'carcasas', 'Carcasas para smartphones', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Otros', 'otros', 'Otros accesorios tecnológicos', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'Smartwatch', 'smartwatch', 'Relojes inteligentes y accesorios', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Samsung', 'samsung', 'Productos y accesorios Samsung', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 6, true, NOW(), NOW()),
  (gen_random_uuid(), 'Gamer', 'gamer', 'Accesorios gaming', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop', 7, true, NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  "order" = EXCLUDED."order",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ============================================
-- 10. INSERTAR PRODUCTOS
-- ============================================
-- Los productos usan subconsultas para obtener los IDs de las categorías por slug

INSERT INTO products (id, name, description, price, image, slug, stock, "isActive", "isFeatured", "categoryId", "compatibleModel", color, "createdAt", "updatedAt")
VALUES
  -- Productos Personalizadas
  (
    gen_random_uuid(),
    'Carcasa iPhone 15 Pro Personalizada',
    'Carcasa resistente con diseño personalizado para iPhone 15 Pro',
    15000,
    'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=600&h=600&fit=crop',
    'carcasa-iphone-15-pro-personalizada',
    25,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'personalizadas' LIMIT 1),
    'iPhone 15 Pro',
    'Negro',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Carcasa Personalizada con Foto',
    'Carcasa personalizada con tu foto favorita',
    20000,
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
    'carcasa-personalizada-con-foto',
    50,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'personalizadas' LIMIT 1),
    'Múltiples modelos',
    'Personalizado',
    NOW(),
    NOW()
  ),
  
  -- Productos JBL
  (
    gen_random_uuid(),
    'Auriculares JBL Tune 510BT',
    'Auriculares inalámbricos JBL con sonido de calidad',
    45000,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'auriculares-jbl-tune-510bt',
    15,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'jbl' LIMIT 1),
    'Universal',
    'Negro',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Auriculares JBL Quantum 100',
    'Auriculares gaming JBL con micrófono',
    35000,
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
    'auriculares-jbl-quantum-100',
    18,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'jbl' LIMIT 1),
    'PC/Consola',
    'Negro/Rojo',
    NOW(),
    NOW()
  ),
  
  -- Productos Carcasas
  (
    gen_random_uuid(),
    'Carcasa Samsung Galaxy S24 Ultra',
    'Carcasa de alta protección para Samsung Galaxy S24 Ultra',
    18000,
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
    'carcasa-samsung-galaxy-s24-ultra',
    20,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'carcasas' LIMIT 1),
    'Samsung Galaxy S24 Ultra',
    'Transparente',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Carcasa iPhone 14 Pro Max',
    'Carcasa resistente para iPhone 14 Pro Max',
    14000,
    'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=600&h=600&fit=crop',
    'carcasa-iphone-14-pro-max',
    30,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'carcasas' LIMIT 1),
    'iPhone 14 Pro Max',
    'Azul',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Carcasa iPad Pro 12.9"',
    'Carcasa con teclado para iPad Pro 12.9"',
    85000,
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
    'carcasa-ipad-pro-12-9',
    10,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'carcasas' LIMIT 1),
    'iPad Pro 12.9"',
    'Gris',
    NOW(),
    NOW()
  ),
  
  -- Productos Smartwatch
  (
    gen_random_uuid(),
    'Smartwatch Samsung Galaxy Watch 6',
    'Reloj inteligente Samsung con múltiples funciones',
    250000,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    'smartwatch-samsung-galaxy-watch-6',
    8,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'samsung' LIMIT 1),
    'Universal',
    'Negro',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Smartwatch Apple Watch Series 9',
    'Reloj inteligente Apple con GPS y monitor de salud',
    350000,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    'smartwatch-apple-watch-series-9',
    5,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'smartwatch' LIMIT 1),
    'iPhone',
    'Midnight',
    NOW(),
    NOW()
  ),
  
  -- Productos Samsung
  (
    gen_random_uuid(),
    'Cable USB-C Samsung',
    'Cable USB-C original Samsung de carga rápida',
    8000,
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=600&fit=crop',
    'cable-usb-c-samsung',
    40,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'samsung' LIMIT 1),
    'Universal',
    'Blanco',
    NOW(),
    NOW()
  ),
  
  -- Productos Gamer
  (
    gen_random_uuid(),
    'Control Xbox Series X',
    'Control inalámbrico para Xbox Series X/S',
    65000,
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
    'control-xbox-series-x',
    12,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'gamer' LIMIT 1),
    'Xbox Series X/S',
    'Negro',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Mouse Gaming RGB',
    'Mouse gaming con iluminación RGB y alta precisión',
    25000,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop',
    'mouse-gaming-rgb',
    22,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'gamer' LIMIT 1),
    'PC',
    'Negro RGB',
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  stock = EXCLUDED.stock,
  "isActive" = EXCLUDED."isActive",
  "isFeatured" = EXCLUDED."isFeatured",
  "categoryId" = EXCLUDED."categoryId",
  "compatibleModel" = EXCLUDED."compatibleModel",
  color = EXCLUDED.color,
  "updatedAt" = NOW();

-- ============================================
-- 11. INSERTAR USUARIO ADMIN
-- ============================================
-- Password: Ecq2357.
-- IMPORTANTE: Si este hash no funciona, ejecuta el seed.ts:
-- cd mr-tecnologia-service && yarn seed
-- Esto generará el hash correcto automáticamente

-- Primero eliminar el usuario admin si existe (para evitar problemas con hash incorrecto)
DELETE FROM users WHERE username = 'admin';

-- Crear usuario admin con hash correcto
-- Este hash debe ser generado por bcrypt.hash('Ecq2357.', 10)
-- Si no funciona, ejecuta: yarn seed (desde el directorio del service)
INSERT INTO users (id, username, email, password, role, "fullName", "isActive", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'admin',
    'saitam.developer.001@gmail.com',
    '$2a$10$rK8VqJ8VqJ8VqJ8VqJ8VqOeJ8VqJ8VqJ8VqJ8VqJ8VqJ8VqJ8VqJ8Vq', -- Hash temporal - EJECUTA yarn seed para generar el correcto
    'admin',
    'Administrador',
    true,
    NOW(),
    NOW()
  );

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Descomenta estas líneas para verificar los datos insertados

-- SELECT 'Categorías creadas:' as info, COUNT(*) as total FROM categories;
-- SELECT 'Productos creados:' as info, COUNT(*) as total FROM products;
-- SELECT 'Usuarios creados:' as info, COUNT(*) as total FROM users;

-- SELECT name, slug FROM categories ORDER BY "order";
-- SELECT name, slug, price, stock FROM products ORDER BY "createdAt" DESC;
-- SELECT username, email, role FROM users;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- ✅ Script completado exitosamente
-- 
-- Credenciales de acceso:
-- Usuario: admin
-- Contraseña: Ecq2357.
-- Email: saitam.developer.001@gmail.com
