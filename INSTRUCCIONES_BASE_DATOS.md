# Instrucciones para Configurar la Base de Datos

## ⚠️ IMPORTANTE: Ejecutar el Script SQL

El error `relation "orders" does not exist` indica que las tablas no han sido creadas en Supabase. Debes ejecutar el script SQL completo.

## Pasos para Configurar la Base de Datos

### 1. Acceder a Supabase SQL Editor

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** en el menú lateral
3. Haz clic en **New Query**

### 2. Ejecutar el Script Completo

1. Abre el archivo `SEED_COMPLETE.sql` en este proyecto
2. **Copia TODO el contenido** del archivo
3. Pega el contenido en el SQL Editor de Supabase
4. Haz clic en **Run** o presiona `Ctrl+Enter` (o `Cmd+Enter` en Mac)

### 3. Verificar que las Tablas se Crearon

Ejecuta esta consulta para verificar:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver estas tablas:
- `categories`
- `customers`
- `order_items`
- `orders`
- `products`
- `users`

### 4. Verificar los Datos

Ejecuta estas consultas para verificar que los datos se insertaron:

```sql
-- Verificar categorías
SELECT COUNT(*) FROM categories;

-- Verificar productos
SELECT COUNT(*) FROM products;

-- Verificar usuario admin
SELECT username, email, role FROM users WHERE username = 'admin';

-- Verificar clientes (debería estar vacío inicialmente)
SELECT COUNT(*) FROM customers;
```

## Estructura de Tablas Creadas

El script crea:

1. **Enums:**
   - `user_role`: 'admin', 'manager'
   - `order_status`: 'pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'
   - `payment_method`: 'webpay', 'transfer', 'cash'
   - `payment_status`: 'pending', 'approved', 'rejected', 'cancelled'

2. **Tablas:**
   - `categories`: Categorías de productos
   - `customers`: Clientes registrados
   - `users`: Usuarios administradores
   - `products`: Productos
   - `orders`: Órdenes de compra
   - `order_items`: Items de cada orden

3. **Datos Iniciales:**
   - 7 categorías con imágenes
   - 12 productos con imágenes
   - 1 usuario admin (username: `admin`, password: `Ecq2357.`)

## Solución de Problemas

### Error: "relation already exists"
Si obtienes este error, significa que algunas tablas ya existen. El script usa `CREATE TABLE IF NOT EXISTS`, así que debería ser seguro ejecutarlo de nuevo.

### Error: "duplicate key value"
Si obtienes este error en los INSERT, significa que los datos ya existen. El script usa `ON CONFLICT DO UPDATE`, así que debería actualizar los datos existentes.

### Limpiar y Empezar de Nuevo (Opcional)

Si quieres empezar desde cero, ejecuta esto ANTES del script principal:

```sql
-- ⚠️ CUIDADO: Esto eliminará TODOS los datos
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
```

Luego ejecuta el `SEED_COMPLETE.sql` completo.

## Credenciales del Admin

Después de ejecutar el script, puedes iniciar sesión en el backoffice con:

- **Username:** `admin`
- **Password:** `Ecq2357.`
- **Email:** `saitam.developer.001@gmail.com`

## Notas

- El script es idempotente: puedes ejecutarlo múltiples veces sin problemas
- Los datos de ejemplo incluyen imágenes reales de Unsplash
- Las contraseñas están hasheadas con bcrypt
- Todos los productos tienen stock inicial de 25 unidades
