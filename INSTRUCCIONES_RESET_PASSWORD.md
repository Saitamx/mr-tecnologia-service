# Instrucciones para Resetear Contraseña del Admin

## Problema
No puedes iniciar sesión con el usuario admin aunque las credenciales sean correctas.

## Solución Rápida (RECOMENDADA)

### Opción 1: Usar el endpoint de reset (MÁS FÁCIL)

1. El backend tiene un endpoint temporal para resetear la contraseña del admin
2. Haz una petición POST a:
   ```
   https://mr-tecnologia-service-production.up.railway.app/auth/reset-admin-password
   ```
3. Puedes usar Postman, curl, o el navegador:
   ```bash
   curl -X POST https://mr-tecnologia-service-production.up.railway.app/auth/reset-admin-password
   ```
4. Esto reseteará la contraseña del admin a: `Ecq2357.`
5. Intenta iniciar sesión nuevamente

### Opción 2: Ejecutar el seed.ts

1. Clona el repositorio localmente (si no lo tienes)
2. Ve al directorio del service:
   ```bash
   cd mr-tecnologia-service
   ```
3. Instala dependencias:
   ```bash
   yarn install
   ```
4. Configura las variables de entorno en un archivo `.env`:
   ```
   DB_HOST=aws-0-us-west-2.pooler.supabase.com
   DB_PORT=6543
   DB_USERNAME=postgres.qcyyaedhqxaizehqbxva
   DB_PASSWORD=Ecq235713.-
   DB_DATABASE=postgres
   ```
5. Ejecuta el seed:
   ```bash
   yarn seed
   ```
6. Esto creará/actualizará el usuario admin con el hash correcto

### Opción 3: Ejecutar script SQL

1. Ejecuta el script `RESETEAR_ADMIN.sql` en Supabase
2. Luego ejecuta el seed.ts (Opción 2)

## Verificación

Después de ejecutar cualquiera de las opciones:

1. Intenta iniciar sesión con:
   - Usuario: `admin`
   - Contraseña: `Ecq2357.`

2. Si sigue fallando, verifica en Supabase:
   ```sql
   SELECT username, email, role, "isActive" FROM users WHERE username = 'admin';
   ```
   
   Asegúrate de que:
   - El usuario existe
   - `isActive` es `true`
   - El `role` es `admin`

## Nota Importante

El endpoint de reset (`/auth/reset-admin-password`) es temporal y debería ser removido o protegido en producción. Por ahora está disponible para solucionar el problema de login.
