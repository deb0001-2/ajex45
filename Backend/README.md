# Odo HRMS Backend

A REST API backend for the Odo HRMS frontend (`odo.hrms`). It mirrors the exact
data model your UI already expects — employees, attendance, leaves, leave
balances, announcements, holidays, meetings, and dashboard stats — the ones
currently faked in `src/mockData.js` with `localStorage`.

**Zero external dependencies.** It's built entirely on Node's built-in `http`
and `crypto` modules, so there is no `npm install` step and nothing to break.

## Run it

```bash
cd hrms-backend
node server.js
# -> Odo HRMS backend running at http://localhost:4000
```

That's it. On first run it creates `data/db.json`, seeded with the same
employees, leaves, and attendance records as the frontend's mock data.

To reset the data back to the seed at any time:

```bash
npm run reset-db   # or: rm data/db.json
```

Optional environment variables:

| Variable      | Default                         | Purpose                          |
|---------------|----------------------------------|-----------------------------------|
| `PORT`        | `4000`                           | HTTP port                         |
| `JWT_SECRET`  | `odo-hrms-dev-secret-change-me`  | Signing secret for auth tokens — **set a real one in production** |

## Default credentials

Same as the frontend's hardcoded login checks:

| Role     | Email                       | Password      |
|----------|------------------------------|---------------|
| Admin    | `sarah.jenkins@odoo.co`      | `admin123`    |
| Employee | any other employee's email   | `employee123` |

(e.g. `rahul.sharma@odoo.co` / `employee123`)

## Auth model

`POST /api/auth/login` returns a signed token (a lightweight HS256 JWT, no
library needed). Send it back as `Authorization: Bearer <token>` on every
other request. Tokens expire after 12 hours.

Two permission tiers:
- **auth** — any logged-in employee
- **admin** — only the employee flagged `isAdmin: true` (Sarah Jenkins by default)

## API Reference

All responses are JSON. All routes except `/api/auth/login` and `/api/health`
require the `Authorization` header.

### Auth
| Method | Path             | Access | Description |
|--------|------------------|--------|--------------|
| POST   | `/api/auth/login`| Public | `{ email, password }` → `{ token, user }` |
| GET    | `/api/auth/me`   | Auth   | Current logged-in user |

### Employees
| Method | Path                  | Access | Description |
|--------|-----------------------|--------|--------------|
| GET    | `/api/employees`             | Auth  | List all (filter with `?department=` `?status=`) |
| GET    | `/api/employees/:id`         | Auth  | One employee |
| POST   | `/api/employees`             | Admin | Create employee |
| PUT    | `/api/employees/:id`         | Admin | Update employee |
| DELETE | `/api/employees/:id`         | Admin | Remove employee |

### Attendance
| Method | Path                          | Access | Description |
|--------|-------------------------------|--------|--------------|
| GET    | `/api/attendance`             | Auth   | Filter with `?date=YYYY-MM-DD` `?employeeId=` |
| GET    | `/api/attendance/heatmap`     | Auth   | Calendar heatmap data |
| POST   | `/api/attendance/checkin`     | Auth   | Check in as self (admins may pass `{ employeeId }` to check in on someone's behalf) |
| POST   | `/api/attendance/checkout`    | Auth   | Check out as self |

### Leaves
| Method | Path                              | Access | Description |
|--------|-----------------------------------|--------|--------------|
| GET    | `/api/leaves`                     | Auth   | Own leaves (employees) or all (admin, filter with `?employeeId=` `?status=`) |
| GET    | `/api/leaves/balance/:employeeId` | Auth   | Leave balance (self or admin only) |
| POST   | `/api/leaves`                     | Auth   | Apply for leave: `{ type, startDate, endDate, days, reason }` |
| PATCH  | `/api/leaves/:id`                 | Admin  | Approve/reject: `{ status: "Approved"|"Rejected", comment? }` — deducts balance automatically on approval |

### Misc
| Method | Path                    | Access | Description |
|--------|-------------------------|--------|--------------|
| GET    | `/api/announcements`    | Auth   | List announcements |
| POST   | `/api/announcements`    | Admin  | Create: `{ title, content, category? }` |
| GET    | `/api/holidays`         | Auth   | Upcoming holidays (`daysLeft` computed live) |
| GET    | `/api/meetings`         | Auth   | Today's meetings |
| GET    | `/api/stats`            | Auth   | Dashboard summary counts |
| GET    | `/api/health`           | Public | Health check |

## Example

```bash
# Log in
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.jenkins@odoo.co","password":"admin123"}'

# Use the returned token
curl http://localhost:4000/api/employees \
  -H "Authorization: Bearer <token>"
```

## Wiring up the frontend

The frontend currently reads/writes through the synchronous `db` object in
`src/mockData.js` (backed by `localStorage`). To point it at this API instead,
the `db.*` calls need to become `fetch`-based and `await`ed, since network
calls are asynchronous. The data shapes returned by this API match the
frontend's mock objects field-for-field, so most call sites just need an
`await` added and the local `db.method()` call swapped for a `fetch()` to the
matching endpoint above.

If you'd like, I can go through `src/main.js` and do that rewiring for you —
just say the word.

## Project structure

```
hrms-backend/
├── server.js              # entry point
├── data/db.json           # generated on first run (git-ignored)
└── src/
    ├── db.js               # JSON-file persistence
    ├── seed.js             # default data (mirrors frontend mockData.js)
    ├── router.js           # request routing + auth guards + CORS
    ├── utils/
    │   ├── http.js         # JSON responses, body parsing
    │   ├── auth.js         # token sign/verify, password hashing
    │   └── sanitize.js     # strips password hashes from responses
    └── routes/
        ├── auth.js
        ├── employees.js
        ├── attendance.js
        ├── leaves.js
        └── misc.js         # announcements, holidays, meetings, stats
```

## Notes on the data store

Data lives in `data/db.json`, read and rewritten on every request. This is
intentionally simple and fine for a demo or small team tool. For production
use, this doc's data access is centralized in `src/db.js`, making it a small,
contained job to swap in a real database (Postgres, SQLite, etc.) without
touching the route logic.
