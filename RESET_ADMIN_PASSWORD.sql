-- ============================================
-- SCRIPT PARA RESETEAR CONTRASEÑA DEL ADMIN
-- ============================================
-- Ejecuta este script directamente en Supabase SQL Editor
-- Password: Ecq2357.
-- Hash bcrypt generado: $2b$10$PGyPCIrOMUaMQ7wHTZYr4.196xFv23C.R9e81LTDhrslTWTK3Cqwq

-- Eliminar usuario admin existente si existe
DELETE FROM users WHERE username = 'admin';

-- Crear usuario admin con hash correcto
INSERT INTO users (id, username, email, password, role, "fullName", "isActive", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'admin',
    'saitam.developer.001@gmail.com',
    '$2b$10$PGyPCIrOMUaMQ7wHTZYr4.196xFv23C.R9e81LTDhrslTWTK3Cqwq', -- Hash bcrypt de "Ecq2357."
    'admin',
    'Administrador',
    true,
    NOW(),
    NOW()
  );

-- Verificar que el usuario fue creado correctamente
SELECT 
  username, 
  email, 
  role, 
  "isActive",
  "createdAt"
FROM users 
WHERE username = 'admin';

-- ============================================
-- CREDENCIALES DE ACCESO
-- ============================================
-- Usuario: admin
-- Contraseña: Ecq2357.
-- Email: saitam.developer.001@gmail.com
