# Verification (M5)

Verification record for the alfood ⇄ alfood-api integration. Run from the repo
root against the backend in the sibling repo `../alfood-api`.

## Automated verification

| Check | Command | Result |
| --- | --- | --- |
| Type-check | `npm run typecheck` | ✅ clean |
| Production build | `npm run build` | ✅ built |
| Test suite | `npm test` | ✅ 45 passing (17 files) |
| Coverage | `npm run test:coverage` | ✅ 92% stmts / 90% branches |

Coverage is concentrated in the logic layer (hooks, `http` clients, forms, auth
= ~95–100%). The remainder is static composition (`App`, `index`, `Banner`,
`Footer`, `NavBar`, `Home`, `RestaurantShowcase`) with no behavior to assert.

Static hygiene: no `console.log`, no `alert()`, no hardcoded API URLs, no
`TODO`/`FIXME` in `src`.

## Live backend contract smoke test

Against a running backend at `http://localhost:8000` (`curl`):

| Endpoint | Expectation | Result |
| --- | --- | --- |
| `GET /api/v1/restaurantes/` | envelope `{ count, next, previous, results }` | ✅ shape matches `IPagination` |
| `GET /api/v2/restaurantes/` (no token) | `401` | ✅ 401 (guard active) |
| `GET /api/v2/tags/` (no token) | `401` | ✅ 401 |
| `POST /api/v2/auth/login` (empty body) | `400` validation | ✅ 400 |

The frontend's contract assumptions (public envelope, JWT guard, login
validation) hold against the live backend.

## Known environment gap (blocks authenticated E2E here)

`POST /api/v2/auth/login` currently returns **500** for any credentials because
the backend's `ADMIN_PASSWORD_HASH` is **empty** in `../alfood-api/.env`. Admin
auth is therefore not configured in this environment, so the authenticated CRUD
flows (login → restaurants/dishes create/edit/delete → logout) cannot be
exercised end-to-end until a backend admin password is set:

```bash
# in ../alfood-api
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
# paste into ADMIN_PASSWORD_HASH in ../alfood-api/.env, then restart the API
```

This is a backend setup step, not a frontend defect. Once set, bad credentials
return `401` and valid credentials return `200 { access_token }`.

> Note: the frontend `LoginPage` shows the generic "Invalid credentials" message
> for any login failure, including a `500`. Distinguishing server errors from bad
> credentials is a possible follow-up, out of scope for M5.

## Manual QA checklist (run once the backend has data + admin credentials)

Prerequisites: backend up (`docker compose up -d` + `npm run migration:run` +
`npm run start:dev` in `../alfood-api`), `ADMIN_PASSWORD_HASH` set, and the
frontend running (`npm run dev`).

Public
- [ ] `/` renders the home page; "Discover the best restaurants" link goes to `/restaurants`.
- [ ] `/restaurants` lists restaurants with their nested dishes; loading and error states render.
- [ ] "Load more" appends the next page and disappears on the last page.

Auth
- [ ] Visiting `/admin/restaurants` while logged out redirects to `/admin/login`.
- [ ] Login with wrong credentials shows the error and stays on the page.
- [ ] Login with valid credentials lands on `/admin/restaurants`.
- [ ] An expired/invalid token (e.g. clear `localStorage`) triggers a `401` → redirect to login on the next admin request.
- [ ] "Log out" clears the token and returns to the login page.

Admin CRUD — restaurants
- [ ] List loads; empty name shows a validation error and does not submit.
- [ ] Create shows the success Snackbar and returns to the list with the new row.
- [ ] Edit pre-fills the name, saves with `PUT`, and returns to the list.
- [ ] Delete removes the row (list refetches after cache invalidation).

Admin CRUD — dishes
- [ ] Tag and Restaurant selects populate; empty required fields show validation errors.
- [ ] Create with an image posts `multipart/form-data` and returns to the list.
- [ ] Edit pre-fills fields; saving **without** picking a new image keeps the existing image.
- [ ] An image over 5MB or a non-image file is rejected with a validation error.
- [ ] Delete removes the row.
