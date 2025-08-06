# 🎯 Ejercicios de Evaluación - NestJS y Prisma ORM

## 📋 Descripción General

Este proyecto contiene 10 ejercicios diseñados para evaluar el conocimiento de NestJS y Prisma ORM. Cada ejercicio debe ser completado con su correspondiente testing, y **solo se puede hacer commit cuando todos los tests pasen correctamente**.

## 🚀 Configuración Inicial

### Prerrequisitos
- Node.js (versión 18 o superior)
- Yarn o npm
- Git

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd examen

# Instalar dependencias
yarn install

# Configurar la base de datos
yarn db:generate
yarn db:migrate
```

### Variables de Entorno
El archivo `.env` ya está configurado con:
```
DATABASE_URL="file:./dev.db"
```

## 📚 Ejercicios

### ✅ Ejercicio 1: DTOs con Validación
**Archivo**: `src/exercises/exercise1/user.dto.ts`
**Test**: `src/exercises/exercise1/user.dto.spec.ts`

**Objetivo**: Crear DTOs para usuarios con validaciones usando class-validator.

**Requisitos**:
- `CreateUserDto` con validaciones para email, name y age
- `UpdateUserDto` que extienda de `CreateUserDto` con campos opcionales
- Validaciones apropiadas (email válido, nombre mínimo 2 caracteres, edad entre 18-100)

### ✅ Ejercicio 2: Servicio CRUD
**Archivo**: `src/exercises/exercise2/users.service.ts`
**Test**: `src/exercises/exercise2/users.service.spec.ts`

**Objetivo**: Implementar un servicio completo de usuarios con Prisma.

**Requisitos**:
- Métodos CRUD completos (create, findAll, findOne, update, remove)
- Paginación en findAll
- Manejo de errores de Prisma
- Validación de existencia de registros

### ✅ Ejercicio 3: Controlador REST
**Archivo**: `src/exercises/exercise3/users.controller.ts`
**Test**: `src/exercises/exercise3/users.controller.spec.ts`

**Objetivo**: Crear un controlador REST completo para usuarios.

**Requisitos**:
- Endpoints: GET /users, GET /users/:id, POST /users, PATCH /users/:id, DELETE /users/:id
- Uso de DTOs del ejercicio 1
- Códigos de estado HTTP apropiados
- Manejo de parámetros de query para paginación

### ✅ Ejercicio 4: Relaciones con Prisma
**Archivo**: `src/exercises/exercise4/posts.service.ts`
**Test**: `src/exercises/exercise4/posts.service.spec.ts`

**Objetivo**: Implementar un servicio de posts con relaciones complejas.

**Requisitos**:
- CRUD completo para posts
- Relaciones con usuarios (autores) y tags
- Métodos especializados (findByAuthor, findWithTags)
- Manejo de relaciones many-to-many

### ✅ Ejercicio 5: Pipes Personalizados
**Archivo**: `src/exercises/exercise5/validation.pipe.ts`
**Test**: `src/exercises/exercise5/validation.pipe.spec.ts`

**Objetivo**: Crear pipes de validación personalizados.

**Requisitos**:
- `UserExistsPipe` para validar existencia de usuarios
- `PostExistsPipe` para validar existencia de posts
- Decoradores personalizados
- Manejo de errores apropiados

### ✅ Ejercicio 6: Filtros de Excepción
**Archivo**: `src/exercises/exercise6/exception.filter.ts`
**Test**: `src/exercises/exercise6/exception.filter.spec.ts`

**Objetivo**: Implementar filtros de excepción para errores de Prisma.

**Requisitos**:
- Filtro para `PrismaClientKnownRequestError`
- Filtro para `PrismaClientValidationError`
- Filtro global para errores no manejados
- Logging de errores

### ✅ Ejercicio 7: Interceptor de Transformación
**Archivo**: `src/exercises/exercise7/transform.interceptor.ts`
**Test**: `src/exercises/exercise7/transform.interceptor.spec.ts`

**Objetivo**: Crear un interceptor que estandarice las respuestas de la API.

**Requisitos**:
- Formato estándar: `{ success: boolean, data: any, message?: string, timestamp: string }`
- Manejo de diferentes tipos de respuesta
- Exclusión de rutas específicas
- Decorador para saltar transformación

### ✅ Ejercicio 8: Guards de Autenticación
**Archivo**: `src/exercises/exercise8/auth.guard.ts`
**Test**: `src/exercises/exercise8/auth.guard.spec.ts`

**Objetivo**: Implementar un guard básico de autenticación.

**Requisitos**:
- Validación de header Authorization
- Token simulado: "Bearer valid-token"
- Decorador `@Public()` para rutas públicas
- Manejo de errores de autenticación

### ✅ Ejercicio 9: Middleware de Logging
**Archivo**: `src/exercises/exercise9/logger.middleware.ts`
**Test**: `src/exercises/exercise9/logger.middleware.spec.ts`

**Objetivo**: Crear un middleware para logging de requests.

**Requisitos**:
- Logging de inicio y fin de requests
- Información: método, URL, IP, User-Agent, duración
- Implementación como clase y función
- Cálculo de duración de requests

### ✅ Ejercicio 10: Tests E2E
**Archivo**: `test/exercises.e2e-spec.ts`

**Objetivo**: Implementar tests end-to-end completos.

**Requisitos**:
- Tests para todos los endpoints de usuarios
- Validación de respuestas HTTP
- Manejo de base de datos de test
- Casos de error y validación

## 🧪 Ejecución de Tests

### Tests Unitarios
```bash
# Ejecutar todos los tests unitarios
yarn test

# Ejecutar tests en modo watch
yarn test:watch

# Ejecutar tests con coverage
yarn test:cov
```

### Tests E2E
```bash
# Ejecutar tests end-to-end
yarn test:e2e
```

### Todos los Tests
```bash
# Ejecutar tests unitarios y e2e
yarn pre-commit
```

## 🔒 Pre-commit Hook

El proyecto está configurado con Husky para ejecutar automáticamente los tests antes de cada commit:

```bash
# El hook se ejecuta automáticamente al hacer commit
git add .
git commit -m "Mi commit"

# Si los tests fallan, el commit se cancela
```

## 📊 Criterios de Evaluación

### Funcionalidad (40%)
- ✅ Todos los endpoints funcionan correctamente
- ✅ Validaciones implementadas apropiadamente
- ✅ Manejo de errores elegante
- ✅ Relaciones de base de datos funcionando

### Testing (30%)
- ✅ Todos los tests pasan
- ✅ Coverage mínimo del 80%
- ✅ Tests unitarios y e2e completos
- ✅ Casos de error cubiertos

### Código Limpio (20%)
- ✅ Código legible y bien estructurado
- ✅ Seguimiento de buenas prácticas
- ✅ Documentación apropiada
- ✅ Nombres descriptivos

### Arquitectura (10%)
- ✅ Separación de responsabilidades
- ✅ Uso correcto de decoradores
- ✅ Configuración global apropiada
- ✅ Patrones de diseño aplicados

## 🚀 Comandos Útiles

```bash
# Desarrollo
yarn start:dev          # Servidor en modo desarrollo
yarn start:debug        # Servidor en modo debug

# Base de datos
yarn db:generate        # Generar cliente de Prisma
yarn db:migrate         # Ejecutar migraciones
yarn db:reset           # Resetear base de datos

# Testing
yarn test               # Tests unitarios
yarn test:e2e           # Tests e2e
yarn test:cov           # Tests con coverage

# Linting y formateo
yarn lint               # Linting
yarn format             # Formateo de código
```

## 📝 Notas Importantes

1. **IMPORTANTE**: Solo puedes hacer commit cuando TODOS los tests pasen
2. Cada ejercicio debe tener su archivo de test correspondiente
3. La base de datos se resetea automáticamente en los tests e2e
4. Usa `yarn start:dev` para desarrollo
5. Los logs aparecerán en la consola durante el desarrollo

## 🆘 Solución de Problemas

### Tests Fallando
```bash
# Verificar que la base de datos esté sincronizada
yarn db:migrate

# Regenerar el cliente de Prisma
yarn db:generate

# Ejecutar tests con más detalle
yarn test --verbose
```

### Errores de Base de Datos
```bash
# Resetear la base de datos
yarn db:reset

# Verificar el esquema
npx prisma studio
```

### Errores de Dependencias
```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules yarn.lock
yarn install
```

## 🎉 ¡Éxito!

Una vez que todos los ejercicios estén completados y los tests pasen, habrás demostrado un conocimiento sólido de:

- ✅ NestJS framework
- ✅ Prisma ORM
- ✅ Testing en NestJS
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Autenticación y autorización
- ✅ Middleware e interceptores
- ✅ Arquitectura de aplicaciones

¡Buena suerte con tu evaluación! 🚀 