# 🚀 Backend Technical Test - NestJS API

Esta es una API profesional desarrollada como prueba técnica, enfocada en la escalabilidad, seguridad y el uso de tecnologías modernas en el ecosistema Node.js.

## 🛠️ Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
  **Seguridad:** [Bcrypt](https://www.npmjs.com/package/bcrypt) (Hashing de contraseñas)
- **Autenticación:** [JWT](https://jwt.io/) (JSON Web Tokens)
- **Lenguaje:** TypeScript

---

## 📋 Características

- **Seguridad Criptográfica:** Implementación de **Bcrypt** para el hashing de contraseñas con un factor de coste (salt) seguro antes de la persistencia.
- **Autenticación Robusta:** Flujo completo de registro e inicio de sesión.
- **Seguridad:** Implementación de JWT para la protección de rutas.
- **Persistencia:** Gestión de datos relacionales en la nube con Supabase.
- **Validación:** Uso de `class-validator` para asegurar la integridad de las peticiones.
- **Arquitectura:** Diseño modular que facilita el mantenimiento y las pruebas unitarias.

---

## ⚙️ Configuración e Instalación

### 0. Requisitos

- Node.js (>= 20.11.0)
- npm (>= 10.2.0)
- PostgreSQL (>= 16)
- pnpm (>= 9.16.1)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Rosyec/BackendToDoList.git

cd BackendToDoList
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

```bash
# Database Connection (Local)
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[database_name]"

# JWT Config
JWT_SECRET="mi_clave_secreta_para_desarrollo"
```

### 4. Iniciar el servidor

```bash
pnpm run start:dev
```

### 5. Acceder a la API

La API estará disponible en `http://localhost:3000`.

### 6. Crear migración del esquema de Prisma

```bash
# Crear el esquema de Prisma en PostgreSQL
npx prisma generate
npx prisma migrate dev --name init
```

La ruta del schema de Prisma es `prisma/schema.prisma`.
