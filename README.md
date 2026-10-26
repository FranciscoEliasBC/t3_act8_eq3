# t3_act8_eq03 — Sistema Escolar (Actividad 8)

Mini sistema en React + Vite basado en el mockup de Figma de la Actividad 7: login real con DummyJSON, sidebar/navbar protegidos y tabla de alumnos con filtros, paginación en la URL y CRUD.

## Equipo

| Integrante | Usuario de GitHub |
|---|---|
| Ruiz Durán Emiliano | 23161115-estud |
| Bautista Centeno Francisco Elias | FranciscoEliasBC |

## API elegida para la tabla

**DummyJSON – usuarios** (`https://dummyjson.com/users`), usados como "alumnos" para respetar el mockup.
Equivalencias: `id` → número de control, `company.department` → carrera, `role` → rol.

## Proyecto desplegado

http://IP_DE_SU_VPS/t3_act8_eq3

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
```

Usuario de prueba: `emilys` / `emilyspass` (más en https://dummyjson.com/users).

## Estructura

```
src/
  components/   Sidebar, Navbar, Modal, ConfirmDialog, Pagination, StudentsTable, StudentForm, Toast...
  pages/        LoginPage, HomePage, StudentsPage, PlaceholderPage
  services/     api.js  (todas las llamadas fetch)
  hooks/        useStudents.js
  context/      AuthContext.jsx (sesión en useState)
```

## Decisiones técnicas

- **Sesión:** `useState` dentro de `AuthContext`; `ProtectedRoute` redirige a `/login` si no hay usuario. Al recargar la página la sesión se pierde (así lo pide la actividad).
- **URL:** `HashRouter`, por lo que la tabla vive en `/#/alumnos?page=2&limit=20&q=...&department=...&role=...` y funciona en Nginx sin configuración extra. Los filtros también se guardan en la URL.
- **CRUD:** primero se hace la petición real (`POST /users/add`, `PUT /users/:id`, `DELETE /users/:id`) y después se actualiza el estado local. Editar y eliminar piden confirmación. Los registros creados localmente no existen en DummyJSON, por eso su edición/eliminación solo se refleja en el estado.

## Despliegue en el VPS (Fase 4)

1. En `vite.config.js` cambia `03` por el número de tu equipo: `base: '/t3_act8_eq05/'`.
2. `npm run build`
3. Sube el **contenido** de `dist/` a la carpeta que sirve Nginx:
   ```bash
   scp -r dist/* usuario@IP_DE_SU_VPS:/var/www/html/t3_act8_eq05/
   ```
   (Si la carpeta no existe: `ssh usuario@IP "sudo mkdir -p /var/www/html/t3_act8_eq05"`; la ruta exacta depende de tu Nginx.)
4. Verifica en `http://IP_DE_SU_VPS/t3_act8_eq05/`.

