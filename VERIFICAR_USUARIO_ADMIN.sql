-- ============================================
-- SCRIPT PARA VERIFICAR Y CREAR USUARIO ADMIN
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase si el usuario admin no existe

-- 1. Verificar si existe el usuario admin
SELECT id, username, email, role, "isActive", "createdAt" 
FROM users 
WHERE username = 'admin';

-- 2. Si no existe, crear el usuario admin
-- Hash bcrypt generado para la contraseña "Ecq2357."
INSERT INTO users (id, username, email, password, role, "fullName", "isActive", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'admin',
    'saitam.developer.001@gmail.com',
    '$2b$10$PGyPCIrOMUaMQ7wHTZYr4.196xFv23C.R9e81LTDhrslTWTK3Cqwq', -- Hash de "Ecq2357."
    'admin',
    'Administrador',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "fullName" = EXCLUDED."fullName",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- 3. Verificar que se creó correctamente
SELECT id, username, email, role, "isActive" 
FROM users 
WHERE username = 'admin';

-- 4. Si necesitas eliminar usuarios duplicados o con IDs incorrectos:
-- ⚠️ CUIDADO: Esto eliminará todos los usuarios excepto el admin
-- DELETE FROM users WHERE username != 'admin';

-- 5. Luego ejecuta el INSERT de arriba para crear el admin con un nuevo ID
