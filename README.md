# Recharges Backend

API para compra de recargas y consulta de historial. Proyecto enfocado en arquitectura limpia, validaciones de dominio y persistencia con PostgreSQL.

## Instrucciones de ejecucion

### Requisitos

- Node.js 18+ (recomendado)
- PostgreSQL 13+ (o Docker)

### Variables de entorno

Cree un archivo `.env` con una de estas opciones:

**Opcion A: DATABASE_URL**

```
DATABASE_URL=postgres://usuario:password@localhost:5432/recharges_db
JWT_SECRET=tu_secreto
```

**Opcion B: parametros separados**

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=recharges_db
JWT_SECRET=tu_secreto
```

### Instalacion y ejecucion

```bash
npm install

# desarrollo
npm run start:dev

# produccion
npm run build
npm run start:prod
```

### Tests

```bash
npm run test
npm run test:e2e
```

## Arquitectura por capas

### Domain

Contiene las reglas de negocio puras, sin dependencias de frameworks:

- **Entities**: `Recharge`, `User` representan el modelo de dominio.
- **Value Objects**: `Amount`, `PhoneNumber` encapsulan validaciones y evitan estados invalidos.
- **Exceptions**: `AmountException`, `PhoneNumberInvalidException` para errores de dominio.

Ubicacion: `src/domain/**`

### Application

Coordina la logica de negocio y define contratos:

- **Use Cases**: `BuyRechargeUseCase`, `GetRechargeHistoryUseCase`, `LoginUseCase`.
- **Interfaces**: `IRechargeRepository`, `IUserRepository`, `ITokenService` para inversion de dependencias.

Ubicacion: `src/application/**`

### Infrastructure

Implementa detalles tecnicos y adaptadores externos:

- **Controllers**: `AuthController`, `RechargeController` manejan HTTP.
- **DTOs**: `LoginDto`, `BuyRechargeDto` validan entrada con class-validator.
- **Auth**: `JwtStrategy` y `JwtTokenService` implementan autenticacion.
- **Persistence**: `RechargeOrmRepository`, `UserInMemoryRepository`, `TransactionModel`.

Ubicacion: `src/infrastructure/**`

## Endpoints principales

- `POST /auth/login` genera JWT.
- `POST /recharges/buy` compra recarga (protegido con JWT).
- `GET /recharges/history` consulta historial (protegido con JWT).

### Flujo de Compra de Recarga
<img width="3348" height="1418" alt="recharge_buy" src="https://github.com/user-attachments/assets/ec180005-5ba6-40b9-b3cb-db6da49ef344" />

## Librerias utilizadas (explicacion breve)

- **@nestjs/common**: decoradores, inyeccion de dependencias y utilidades base del framework.
- **@nestjs/core**: motor principal de NestJS (bootstrap, ciclo de vida).
- **@nestjs/platform-express**: adaptador HTTP basado en Express.
- **@nestjs/config**: carga de variables de entorno y configuracion centralizada.
- **@nestjs/jwt**: emision y verificacion de JWT.
- **@nestjs/passport**: integracion de Passport con NestJS.
- **passport**: middleware de autenticacion extensible.
- **passport-jwt**: estrategia JWT para Passport.
- **@nestjs/typeorm**: integracion oficial de TypeORM con NestJS.
- **typeorm**: ORM para mapear entidades y repositorios a PostgreSQL.
- **pg**: driver de PostgreSQL.
- **class-validator**: validacion declarativa de DTOs con decoradores.
- **class-transformer**: transforma payloads a instancias de clases.
- **rxjs**: soporte de flujos reactivos requerido por NestJS.
- **reflect-metadata**: habilita metadata para decoradores de TypeScript.

## Justificacion breve de decisiones tecnicas

- **Arquitectura limpia + DDD**: decidi separar dominio, aplicacion e infraestructura porque pensaba que asi el core quedaria mas claro y facil de probar. Ademas, DDD me ayuda a modelar el negocio con entidades y value objects, sin mezclar detalles de HTTP o BD.
- **SOLID e inversion de dependencias (DIP)**: preferi que los use cases dependan de interfaces (`IRechargeRepository`, `IUserRepository`, `ITokenService`) porque crei que era la forma correcta de desacoplar la logica. Esto permite mocks en pruebas y cambiar la infraestructura sin tocar el dominio.
- **Inyeccion de dependencias (DI)**: use el contenedor de NestJS para inyectar repositorios y servicios, evitando `new` directos. Asi el codigo queda mas flexible y alineado con SOLID.
- **Entidades de dominio**: `Recharge` es el concepto central (monto, numero, usuario, fecha). `User` lo mantuve como entidad aunque tenga poca logica ahora porque en el flujo de autenticacion viaja su identidad, y pense que era mejor dejarlo en el dominio por si luego se agregan reglas (roles, limites, estados).
- **Value Objects**: `Amount` y `PhoneNumber` encapsulan reglas de negocio. Lo hice asi porque creia que la validacion no debia vivir solo en el DTO, sino tambien en el dominio para asegurar consistencia.
- **JWT**: elegi JWT porque es stateless y sencillo para una API, y evita manejo de sesiones en servidor.
- **TypeORM**: lo use para reducir codigo de persistencia, mantener el mapeo con PostgreSQL y tener repositorios claros.

## Deployment en Render

URL publica: https://recharges-backend.onrender.com

### Paso a paso

1. **Crear la base de datos**
	- En Render, crear un servicio de PostgreSQL.
	- Copiar el `DATABASE_URL` generado.

2. **Crear el servicio web**
	- Conectar el repositorio de GitHub.
	- Seleccionar el branch principal.
	- Definir build y start commands:
	  - Build: `npm install && npm run build`
	  - Start: `npm run start:prod`

3. **Configurar variables de entorno**
	- `DATABASE_URL` con el valor del paso 1.
	- `JWT_SECRET` con un secreto seguro.

4. **Desplegar**
	- Render ejecuta el build y levanta el servicio.
	- Verificar que el endpoint responde en la URL publicada.
