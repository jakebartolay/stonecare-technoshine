# Technoshine Stonecare & Restoration — System Documentation

Overview of the company website and admin system.
Last updated: July 9, 2026

---

## 1. Project Summary

Corporate website for **Technoshine Stonecare and Restoration** with a public-facing site (services, products, gallery, company profile, org chart, contact) and a password-protected **Admin Panel** for managing services, products, employees, and site content.

- **Live/deploy target:** `dev.technoshineph.com` (cPanel auto-deploy)
- **Frontend:** React 18 + TypeScript + Vite, Tailwind CSS, Radix UI (shadcn/ui), Framer Motion, wouter (routing)
- **Backend:** PHP (single-file API), MySQL (`technoshine_data`)
- **Local dev:** Vite dev server + XAMPP PHP built-in server on port 8081

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18, TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS 3, tw-animate-css, shadcn/ui (Radix UI) |
| Routing | wouter |
| Data fetching | TanStack React Query 5 |
| Forms/validation | react-hook-form + zod |
| Animation | Framer Motion, AOS |
| Charts | Recharts |
| Extras | embla-carousel, react-pageflip (company profile), sonner (toasts), lucide-react / react-icons |
| Backend | PHP 8 (PDO/MySQL) |
| Database | MySQL / MariaDB — `technoshine_data` |
| Hosting | cPanel shared hosting, Apache (.htaccess SPA rewrite) |

---

## 3. Folder Structure

```
stonecare-technoshine/
├── .cpanel.yml            # cPanel deployment tasks (build + copy to webroot)
├── .htaccess              # Apache SPA rewrite rules
├── database/
│   └── schema.sql         # Full MySQL schema + seed data
├── public/                # Static assets copied to dist as-is
│   ├── api/admin.php      # Admin/API backend (single-file PHP)
│   ├── contact-submit.php # Contact form email handler
│   ├── company-profile/   # Company profile page assets
│   ├── employees/, team/, images/, logo/
│   └── org-chart.pdf
├── scripts/
│   └── copy-htaccess.js   # Post-build: copies .htaccess into dist
├── src/
│   ├── App.tsx            # All routes (wouter)
│   ├── main.tsx
│   ├── components/        # Site sections (Hero, Services, Gallery, OrgChart, ...)
│   │   ├── help/          # Help center components
│   │   ├── shop/          # Stone Care shop components
│   │   └── ui/            # shadcn/ui primitives
│   ├── hooks/             # use-mobile, use-toast
│   ├── lib/               # admin-store, shop-products, help-products, site-content, use-seo, utils
│   └── pages/             # One component per route (incl. AdminPanel, errors/)
└── dist/                  # Build output (deployed)
```

---

## 4. Routes (Frontend)

### Public pages

| Route | Page |
|---|---|
| `/` | Home |
| `/services`, `/services/:slug` | Services list / individual service showcase |
| `/about` | About |
| `/gallery` | Gallery |
| `/clients` | Clients |
| `/contact` | Contact (assessment request form) |
| `/help`, `/help/product-info/:productId` | Help center / product info |
| `/stone-care/shops`, `/stone-care/shops/:slug` | Stone Care shop / product page |
| `/employees/list` | Employees list |
| `/company-profile`, `/company/company-profile` | Company profile (page-flip book) |
| `/organization-chart`, `/company/organization-chart` | Organization chart |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | Legal pages |
| `/error/400`–`/error/503` | Error pages (400, 401, 403, 404, 500, 503) |

### Admin pages (`/company/admin/...`)

| Route | Page |
|---|---|
| `/company/admin/login` | Admin login |
| `/company/admin/dashboard` | Dashboard (record counts) |
| `/company/admin/services` | Manage service pages + images |
| `/company/admin/products` | Manage shop products |
| `/company/admin/employees` | Manage employees (with CSV export) |
| `/company/admin/content` | Manage content sections |
| `/company/admin` | Admin URL error page |

All admin views live in `src/pages/AdminPanel.tsx` (AdminDashboard, AdminServices, AdminProducts, AdminEmployees, AdminContent).

---

## 5. Backend API (`public/api/admin.php`)

Single PHP endpoint, action-based: `GET/POST /api/admin.php?action=...`

| Action | Method | Purpose |
|---|---|---|
| `login` | POST | Email + password login; sets `technoshine_session` cookie |
| `logout` | POST | Destroys session |
| `me` | GET | Current logged-in user |
| `products` | GET | List products (`?published=true` for public) |
| `products.save` / `products.delete` | POST | Create/update / delete product |
| `employees` | GET | List employees |
| `employees.save` / `employees.delete` | POST | Create/update / soft-delete employee |
| `content` | GET | List content sections |
| `content.save` | POST | Save content section |
| `services` | GET | List service pages + images |
| `services.save` | POST | Save service page + images (transaction) |
| `counts` | GET | Record counts for dashboard |

**Auth:** session token stored hashed (SHA-256) in `sessions` table; cookie `technoshine_session`; passwords bcrypt (`password_hash`).

**DB config via env vars** (with local defaults): `TECHNOSHINE_DB_HOST`, `TECHNOSHINE_DB_NAME`, `TECHNOSHINE_DB_USER`, `TECHNOSHINE_DB_PASS`.

**Contact form:** `public/contact-submit.php` — POST JSON `{name, email, company, message}`; emails assessment requests to `erwin.torrefiel@technoshineph.com` from `contactus@technoshineph.com`.

---

## 6. Database (`database/schema.sql`)

Database: `technoshine_data` (utf8mb4)

| Table | Purpose |
|---|---|
| `users` | Admin accounts (email, bcrypt hash, role: admin/editor) |
| `sessions` | Login sessions (hashed token, expiry, remember-me) |
| `employees` | Employee records (employee_id, position, department, reports_to, photo/signature URLs, status, soft delete) |
| `content_sections` | Keyed CMS content (JSON + text body) |
| `products` | Stone Care shop products (slug, category, size, price, usage, published flag) |
| `service_pages` | Service showcase pages (slug, title, summary, hero image) |
| `service_images` | Gallery images per service (FK to service_pages.slug, sort order) |

Seed data included: default admin user (`admin@technoshineph.com`) and initial employee records.

---

## 7. Development

```bash
npm install
npm run dev        # Vite dev server (0.0.0.0)
npm run api        # PHP server: 127.0.0.1:8081 serving /public (XAMPP PHP)
npm run build      # Production build → dist/ (+ copies .htaccess)
npm run typecheck  # TypeScript check
```

Import database: run `database/schema.sql` in MySQL (phpMyAdmin or CLI).

---

## 8. Deployment

Push to the repo triggers cPanel deployment (`.cpanel.yml`):

1. `npm install` && `npm run build`
2. Clear `/home/technosh/dev.technoshineph.com/`
3. Copy `dist/*` and `.htaccess` to the webroot

`.htaccess` rewrites all non-file requests to `index.html` (SPA routing).

---

## 9. Notes / Conventions

- SEO handled per page via `src/lib/use-seo.ts`.
- Admin state/API client in `src/lib/admin-store.ts`.
- Static product/help data fallbacks in `src/lib/shop-products.ts` and `help-products.ts`.
- Employees admin includes CSV export.
- Trailing-slash duplicate routes are intentional (Apache/cPanel behavior).
