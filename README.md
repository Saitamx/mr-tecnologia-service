# MR Tecnología Service

Backend service para MR Tecnología desarrollado con NestJS.

## Tecnologías

- NestJS
- TypeORM
- PostgreSQL (Supabase)
- JWT Authentication
- Swagger/OpenAPI

## Instalación

```bash
yarn install
```

## Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno según tu entorno

## Desarrollo

```bash
yarn start:dev
```

El servidor se ejecutará en `http://localhost:3004`
La documentación Swagger estará disponible en `http://localhost:3004/api`

## Seed de Base de Datos

Para poblar la base de datos con datos iniciales:

```bash
yarn seed
```

## Despliegue en Railway

1. Crea un nuevo proyecto en Railway
2. Conecta tu repositorio
3. Configura las variables de entorno desde `.env.railway`
4. Railway detectará automáticamente el proyecto Node.js y lo desplegará

## Variables de Entorno para Railway

Ver archivo `.env.railway` para todas las variables necesarias.
