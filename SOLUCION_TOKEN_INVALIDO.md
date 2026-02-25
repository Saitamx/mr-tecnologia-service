# Solución para Error 404 al Acceder a /customers

## Problema

El error `"Usuario con ID 8770fe49-8d71-4a9a-b0a0-0fb51d02d297 no encontrado"` ocurre porque:

1. El token JWT contiene un ID de usuario admin que **ya no existe** en la base de datos
2. Esto puede pasar si:
   - El usuario admin fue eliminado y recreado con un ID diferente
   - La base de datos fue restaurada desde un backup
   - El usuario admin fue recreado manualmente

## Solución Rápida (Recomendada)

### Opción 1: Iniciar Sesión Nuevamente

1. Ve a: `https://mr-tecnologia-front-backoffice.vercel.app/login`
2. Cierra sesión si estás logueado (o borra las cookies del navegador)
3. Inicia sesión nuevamente con:
   - **Username:** `admin`
   - **Password:** `Ecq2357.`
4. Esto generará un **nuevo token** con el ID correcto del usuario admin actual

### Opción 2: Verificar/Crear Usuario Admin en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Abre **SQL Editor**
3. Ejecuta este script para verificar si existe el admin:

```sql
-- Verificar si existe el usuario admin
SELECT id, username, email, role, "isActive", "createdAt" 
FROM users 
WHERE username = 'admin';
```

4. Si **NO existe** o el ID es diferente, ejecuta:

```sql
-- Eliminar admin antiguo si existe
DELETE FROM users WHERE username = 'admin';

-- Crear nuevo admin
INSERT INTO users (id, username, email, password, role, "fullName", "isActive", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'admin',
    'saitam.developer.001@gmail.com',
    '$2b$10$PGyPCIrOMUaMQ7wHTZYr4.196xFv23C.R9e81LTDhrslTWTK3Cqwq',
    'admin',
    'Administrador',
    true,
    NOW(),
    NOW()
  );
```

5. Luego **inicia sesión nuevamente** en el backoffice para obtener un token válido

### Opción 3: Usar el Endpoint de Reset (Temporal)

Puedes llamar al endpoint de reset para asegurar que el admin existe:

```bash
POST https://mr-tecnologia-service-production.up.railway.app/auth/reset-admin-password
```

Luego inicia sesión nuevamente.

## Verificación

Después de hacer login nuevamente, verifica que el token funcione:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña **Application** → **Local Storage** (o **Cookies**)
3. Busca el token de autenticación
4. Intenta acceder a `/customers` nuevamente

## Prevención

Para evitar este problema en el futuro:

1. **No elimines** el usuario admin manualmente de la base de datos
2. Si necesitas resetear la contraseña, usa el endpoint `/auth/reset-admin-password`
3. Si recreas la base de datos, asegúrate de ejecutar el script `SEED_COMPLETE.sql` completo

## Nota Técnica

El código del backend ya fue actualizado para manejar mejor este caso:
- `usersService.findOne()` ahora retorna `null` en lugar de lanzar excepción
- El JWT strategy lanza `UnauthorizedException` (401) en lugar de `NotFoundException` (404)
- Sin embargo, necesitas **hacer un nuevo deploy** del servicio para que estos cambios surtan efecto

Pero la solución más rápida es simplemente **iniciar sesión nuevamente**.
