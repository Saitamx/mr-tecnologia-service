# Solución para Problema de Login

## Problema
El usuario admin no puede iniciar sesión aunque las credenciales sean correctas.

## Causa
El hash bcrypt en el script SQL podría no ser correcto o no coincidir con la contraseña.

## Soluciones

### Opción 1: Ejecutar el seed.ts (RECOMENDADO)

El script `seed.ts` genera el hash correcto automáticamente:

```bash
cd mr-tecnologia-service
yarn seed
```

Este script:
- Se conecta a la base de datos
- Genera el hash bcrypt correcto para "Ecq2357."
- Crea o actualiza el usuario admin

### Opción 2: Ejecutar script SQL de corrección

Ejecuta el archivo `FIX_ADMIN_PASSWORD.sql` en Supabase SQL Editor:

1. Abre Supabase Dashboard
2. Ve a SQL Editor
3. Copia y pega el contenido de `FIX_ADMIN_PASSWORD.sql`
4. Ejecuta el script

### Opción 3: Verificar usuario en base de datos

Ejecuta este SQL en Supabase para verificar el usuario:

```sql
SELECT username, email, role, "isActive" FROM users WHERE username = 'admin';
```

Verifica que:
- El usuario existe
- `isActive` es `true`
- El `role` es `admin`

### Opción 4: Crear nuevo usuario admin

Si nada funciona, crea un nuevo usuario ejecutando el seed.ts completo:

```bash
cd mr-tecnologia-service
yarn seed
```

## Verificación

Después de ejecutar cualquiera de las soluciones:

1. Intenta iniciar sesión con:
   - Usuario: `admin`
   - Contraseña: `Ecq2357.`

2. Si sigue fallando, verifica:
   - Que el backend esté funcionando: `https://mr-tecnologia-service-production.up.railway.app/api`
   - Que CORS esté configurado correctamente
   - Los logs del backend en Railway

## Debug

Para ver qué está pasando, revisa los logs del backend en Railway. El error "Credenciales inválidas" puede significar:

1. El hash no coincide con la contraseña
2. El usuario no existe
3. El usuario está inactivo (`isActive = false`)
4. Hay un problema con la comparación de bcrypt
