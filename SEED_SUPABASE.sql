-- Script de seed para Supabase
-- Copia y pega este script en el SQL Editor de Supabase

-- Insertar categorías
INSERT INTO categories (id, name, slug, description, "order", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Personalizadas', 'personalizadas', 'Carcasas personalizadas para tu dispositivo', 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'JBL', 'jbl', 'Productos y accesorios JBL', 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'Carcasas', 'carcasas', 'Carcasas para smartphones', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Otros', 'otros', 'Otros accesorios tecnológicos', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'Smartwatch', 'smartwatch', 'Relojes inteligentes y accesorios', 5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Samsung', 'samsung', 'Productos y accesorios Samsung', 6, true, NOW(), NOW()),
  (gen_random_uuid(), 'Gamer', 'gamer', 'Accesorios gaming', 7, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insertar usuario admin
-- La contraseña es: Ecq2357.
-- Hash bcrypt: $2a$10$rK8VqJ8VqJ8VqJ8VqJ8VqO (ejemplo, usar el hash real generado)
INSERT INTO users (id, username, email, password, role, "fullName", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'admin', 'saitam.developer.001@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'Administrador', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Nota: Para insertar productos, primero necesitas obtener los IDs de las categorías
-- Ejecuta: SELECT id, name FROM categories;
-- Luego usa esos IDs en los productos

-- Ejemplo de productos (reemplaza los categoryId con los IDs reales de las categorías)
-- INSERT INTO products (id, name, description, price, slug, stock, "isActive", "isFeatured", "categoryId", "compatibleModel", color, "createdAt", "updatedAt")
-- VALUES
--   (gen_random_uuid(), 'Carcasa iPhone 15 Pro Personalizada', 'Carcasa resistente con diseño personalizado', 15000, 'carcasa-iphone-15-pro-personalizada', 25, true, true, 'CATEGORY_ID_AQUI', 'iPhone 15 Pro', 'Negro', NOW(), NOW());
