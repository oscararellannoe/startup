# Startup Planner

Aplicación Next.js (App Router) con Tailwind CSS y Supabase para crear planes personales.

## Requisitos

- Node.js 18+
- npm

## Configuración

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Ejecuta en desarrollo:

   ```bash
   npm run dev
   ```

3. Compila para producción:

   ```bash
   npm run build && npm start
   ```

No se requiere archivo `.env`; el cliente utiliza la URL y anon key pública proporcionadas para Supabase.

## Endpoints disponibles

- `POST /api/auth/signup` – crea cuentas usando Supabase Auth.
- `POST /api/auth/login` – inicia sesión con email y contraseña.
- `POST /api/auth/logout` – cierra sesión del usuario actual.
- `POST /api/plans/create` – guarda un plan en la tabla `plans` (`id`, `user_id`, `name`, `inputs_json`).
- `POST /api/plans/list` – lista los planes del usuario autenticado.

Las páginas `/signup`, `/login` y `/dashboard` ofrecen formularios listos para usar.
