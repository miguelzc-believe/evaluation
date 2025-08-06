# Ejercicios de Evaluación - NestJS y Prisma ORM

## Instrucciones Generales

1. **IMPORTANTE**: Solo puedes hacer commit cuando TODOS los tests pasen correctamente
2. Cada ejercicio debe tener su correspondiente archivo de test
3. Ejecuta `yarn test` para verificar que todos los tests pasen
4. Ejecuta `yarn test:cov` para ver el coverage de los tests
5. Usa `yarn start:dev` para ejecutar el servidor en modo desarrollo

## Ejercicios

### Ejercicio 1: Crear un DTO para Usuario
**Archivo**: `src/exercises/exercise1/user.dto.ts`
**Descripción**: Crear un DTO (Data Transfer Object) para la creación de usuarios con validaciones usando class-validator.

**Requisitos**:
- Crear `CreateUserDto` con campos: email (requerido, debe ser email válido), name (requerido, mínimo 2 caracteres), age (opcional, entre 18 y 100)
- Crear `UpdateUserDto` que extienda de `CreateUserDto` pero haga todos los campos opcionales
- Agregar validaciones apropiadas usando decoradores de class-validator

### Ejercicio 2: Implementar un Servicio de Usuarios
**Archivo**: `src/exercises/exercise2/users.service.ts`
**Descripción**: Crear un servicio que maneje las operaciones CRUD para usuarios usando Prisma.

**Requisitos**:
- Implementar métodos: `create`, `findAll`, `findOne`, `update`, `remove`
- Usar PrismaService para las operaciones de base de datos
- Manejar errores apropiadamente (usuario no encontrado, email duplicado, etc.)
- Implementar paginación en `findAll` (limit y offset)

### Ejercicio 3: Crear un Controlador REST
**Archivo**: `src/exercises/exercise3/users.controller.ts`
**Descripción**: Crear un controlador REST que exponga endpoints para manejar usuarios.

**Requisitos**:
- Implementar endpoints: GET /users, GET /users/:id, POST /users, PUT /users/:id, DELETE /users/:id
- Usar los DTOs del ejercicio 1
- Retornar códigos de estado HTTP apropiados
- Implementar manejo de errores con filtros de excepción

### Ejercicio 4: Implementar Relaciones con Prisma
**Archivo**: `src/exercises/exercise4/posts.service.ts`
**Descripción**: Crear un servicio para manejar posts con relaciones a usuarios.

**Requisitos**:
- Implementar métodos para crear, leer, actualizar y eliminar posts
- Incluir la relación con el autor (User) en las consultas
- Implementar método para obtener posts por autor
- Implementar método para obtener posts con sus tags

### Ejercicio 5: Crear un Pipe de Validación Personalizado
**Archivo**: `src/exercises/exercise5/validation.pipe.ts`
**Descripción**: Crear un pipe personalizado para validar que un usuario existe.

**Requisitos**:
- Crear un pipe que valide que un ID de usuario existe en la base de datos
- El pipe debe lanzar una excepción si el usuario no existe
- Implementar el pipe como un decorador personalizado
- Usar el pipe en el controlador de posts

### Ejercicio 6: Implementar Filtros de Excepción
**Archivo**: `src/exercises/exercise6/exception.filter.ts`
**Descripción**: Crear filtros de excepción para manejar errores de Prisma.

**Requisitos**:
- Crear un filtro para manejar `PrismaClientKnownRequestError`
- Crear un filtro para manejar `PrismaClientValidationError`
- Los filtros deben retornar respuestas HTTP apropiadas
- Implementar logging de errores

### Ejercicio 7: Crear un Interceptor de Transformación
**Archivo**: `src/exercises/exercise7/transform.interceptor.ts`
**Descripción**: Crear un interceptor que transforme las respuestas de la API.

**Requisitos**:
- Crear un interceptor que envuelva las respuestas en un formato estándar
- El formato debe incluir: `{ success: boolean, data: any, message?: string }`
- Aplicar el interceptor globalmente
- Excluir ciertos endpoints del interceptor si es necesario

### Ejercicio 8: Implementar Guards de Autenticación
**Archivo**: `src/exercises/exercise8/auth.guard.ts`
**Descripción**: Crear un guard básico de autenticación (simulado).

**Requisitos**:
- Crear un guard que verifique un header de autorización
- El guard debe permitir acceso si el header `Authorization` contiene "Bearer valid-token"
- Implementar un decorador `@Public()` para excluir rutas del guard
- Aplicar el guard globalmente

### Ejercicio 9: Crear un Middleware Personalizado
**Archivo**: `src/exercises/exercise9/logger.middleware.ts`
**Descripción**: Crear un middleware para logging de requests.

**Requisitos**:
- Crear un middleware que loguee información de cada request
- Debe incluir: método HTTP, URL, timestamp, duración de la request
- Implementar el middleware como una clase
- Aplicar el middleware globalmente

### Ejercicio 10: Implementar Tests E2E
**Archivo**: `test/exercises.e2e-spec.ts`
**Descripción**: Crear tests end-to-end para la API de usuarios.

**Requisitos**:
- Crear tests para todos los endpoints de usuarios
- Usar una base de datos de test separada
- Implementar setup y teardown apropiados
- Verificar respuestas HTTP y contenido de las respuestas
- Testear casos de error (usuario no encontrado, validaciones, etc.)

## Cómo Ejecutar los Tests

```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests en modo watch
yarn test:watch

# Ejecutar tests con coverage
yarn test:cov

# Ejecutar tests e2e
yarn test:e2e
```

## Criterios de Evaluación

1. **Funcionalidad**: Todos los endpoints funcionan correctamente
2. **Validación**: Se implementan validaciones apropiadas
3. **Manejo de Errores**: Se manejan errores de forma elegante
4. **Testing**: Todos los tests pasan con coverage mínimo del 80%
5. **Código Limpio**: El código es legible y sigue buenas prácticas
6. **Documentación**: El código está bien documentado

## Notas Importantes

- Asegúrate de que la base de datos esté sincronizada: `npx prisma migrate dev`
- Regenera el cliente de Prisma si cambias el esquema: `npx prisma generate`
- Usa `yarn start:dev` para desarrollo y `yarn start` para producción
- Los tests deben ejecutarse en una base de datos de test separada 