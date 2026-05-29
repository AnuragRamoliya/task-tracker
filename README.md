# Team Task Tracker

Production-grade full stack task tracker with Express, Sequelize, MySQL, Redis, JWT auth, React, TypeScript, Vite, TailwindCSS, React Query, Zustand, Docker, Swagger, and SSE notifications.

## Run

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:4000/api`  
Swagger: `http://localhost:4000/api/docs`

Default admin:

```text
admin@tracker.com
Admin@123
```

## Architecture

Backend uses layered separation:

- `routes`: HTTP routing and middleware composition
- `modules`: thin controllers per feature
- `services`: business logic, RBAC-sensitive workflows, token rotation, task transition rules
- `repositories`: Sequelize query access
- `middleware`: auth, authorization, validation, security, and centralized errors
- `models`, `migrations`, `seeders`: database schema and bootstrapping

Frontend uses:

- React Router for protected app routes
- React Query for server state
- Zustand for auth state
- Reusable table, modal, form field, and loader components
- Role-aware UI actions for managers/admins

## Database

Core tables:

- `organizations`
- `users`
- `projects`
- `tasks`
- `refresh_tokens`

`tasks` includes `title`, `description`, `priority`, `status`, `assignee_id`, `due_date`, and `completed_at`. Indexes are added for `status`, `assignee_id`, `due_date`, and `(assignee_id, status)`.

## Auth And RBAC

JWT access tokens expire in 15 minutes. Refresh tokens expire in 7 days, are stored hashed in the database, and are rotated on refresh. Refresh tokens are sent with HTTP-only cookies.

Roles:

- `ADMIN`: full access
- `MANAGER`: manage projects and tasks
- `MEMBER`: view/update only assigned tasks

Route-level RBAC is enforced with `authorize(...)` middleware, keeping role checks out of controllers.

## Task Rules

Allowed transitions:

- `TODO -> IN_PROGRESS`
- `IN_PROGRESS -> IN_REVIEW`
- `IN_REVIEW -> DONE`
- active states can move to `BLOCKED`

Only an assignee, manager, or admin can change status. The reusable validator lives in `backend/src/utils/taskTransitions.js`.

## Caching

`GET /api/tasks` is cached in Redis with keys:

```text
tasks:user:{assigneeId}:page:{page}:limit:{limit}
```

Task create/update/delete/reassign/status changes invalidate task list caches.

## API

Implemented endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/role`
- `GET /api/projects`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `GET /api/analytics`
- `GET /api/notifications/stream`

## Local Backend Commands

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm test
```

## Future Improvements

- Add audit log history for role and task changes
- Add project membership scoping
- Add refresh-token reuse detection alerts
- Add background jobs for due-date reminders
- Expand Swagger schemas with full request/response examples
