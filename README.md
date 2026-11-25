<div align="center">

# Velora — Modern Persian RTL Digital Storefront

**Full-stack e-commerce platform built with Next.js 16 (Cache Components + Partial Prerendering), React 19, Prisma ORM, Auth.js v5, Tailwind CSS v4, and AI-powered customer review insights.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2d3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![CI](https://github.com/shadmehress-hub/velora/actions/workflows/ci.yml/badge.svg)](https://github.com/shadmehress-hub/velora/actions/workflows/ci.yml)

</div>

---

## Overview

**Velora** is a production-structured Persian (`lang="fa" dir="rtl"`) electronics & digital goods e-commerce application designed with Digikala-inspired UX patterns, strict Zod v4 validation, optimistic Server Actions, Cache Components (`"use cache"`), and a complete Role-Based Admin Dashboard.

### Key Engineering Highlights

- **Next.js 16 Cache Components & Partial Prerendering (`PPR`)**:
  - Static UI shells combined with fine-grained `<Suspense>` streaming boundaries and `"use cache"` / `cacheTag` invalidation (`updateTag`) across product queries and reviews.
  - Request-deferred session helper (`lib/session.ts` via `await connection()`) isolating Auth.js (`@auth/core`) from prerendering validation (`blocking-prerender-crypto`).
- **Authentication & Role-Based Authorization**:
  - Auth.js v5 (`next-auth@5` beta + `@auth/prisma-adapter`) using `Credentials`, `bcryptjs` hashing, and JWT sessions enriched with `user.id` and `user.role` (`admin` / `user`).
- **Persistent Guest-to-User Shopping Cart**:
  - Guest carts tracked securely via `sessionCartId` HTTP cookie (`Cart` + `CartItem`), automatically merging into the authenticated account upon sign-in and enforcing real-time inventory caps.
- **Iranian Checkout & Zarinpal Mock Payment Flow**:
  - Validated Iranian mobile (`09...`) and 10-digit postal code shipping form (`shippingAddressSchema`), transactional stock deduction (`prisma.$transaction`), automatic shipping fee rules (`FREE_SHIPPING_THRESHOLD`), Zarinpal mock gateway (`/payment/[orderId]`), and order tracking (`/orders`, `/orders/[id]`).
- **Customer Reviews & AI Insights (`analyzeProductReviewsAI`)**:
  - Verified-purchase badging, rating distribution breakdown, synchronized aggregate ratings, and AI-generated Persian review summaries (uses Google **Gemini Flash** when `GEMINI_API_KEY` is provided, falling back seamlessly to a deterministic Persian keyword sentiment analyzer).
- **Full Admin Portal (`/admin`)**:
  - KPI dashboard with revenue, stock health, and category inventory valuation charts.
  - Inline stock adjustments, product CRUD (`/admin/products/new`, `/admin/products/[id]`), CSV catalog export, order lifecycle status updates (`/admin/orders`), active cart inspection (`/admin/carts`), and user role management (`/admin/users`).
- **SEO, Observability & Security Hardening**:
  - Dynamic `/sitemap.xml`, `/robots.txt`, vector `/icon.svg`, per-route metadata templates, `/api/health` database liveness probe, and strict HTTP response headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) configured in `next.config.ts`.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js `16.4.6` (App Router, Turbopack, Cache Components, Partial Prefetching) |
| **UI & Styling** | React `19.3`, Tailwind CSS `4.3`, `shadcn` + `@base-ui/react`, `lucide-react`, `next-themes`, `next-persian-fonts` (`Vazirmatn`) |
| **Language & Validation** | TypeScript `5`, Zod `4.6.7` |
| **Authentication** | Auth.js v5 (`next-auth@^5.0.0-beta.32`, `@auth/prisma-adapter`, `bcryptjs`) |
| **Database & ORM** | Prisma `6.19.3` (PostgreSQL — Neon / Supabase / Docker Postgres) |
| **AI Analysis** | Gemini Flash REST integration + built-in Persian NLP fallback |
| **Testing & CI** | Node built-in test runner (`node:test`) + `tsx`, ESLint `9`, GitHub Actions |

---

## Project Structure

```text
velora/
├── app/
│   ├── (auth)/                  # Sign-in & Sign-up pages with ambient auth layout
│   ├── (root)/                  # Storefront (/), Search, Product PDP, About, Cart, Shipping, Payment, Orders
│   ├── admin/                   # Protected Admin Dashboard (Overview, Orders, Products, Carts, Users)
│   ├── api/
│   │   ├── auth/[...nextauth]/  # Auth.js v5 route handler
│   │   └── health/              # Database & server liveness endpoint (GET /api/health)
│   ├── robots.ts                # Crawler directives
│   └── sitemap.ts               # Dynamic product + static route sitemap
├── components/
│   ├── admin/                   # Admin nav, product form, CSV export, quick stock & status controls
│   ├── shared/                  # Header, Cart, Checkout, Product cards/reviews, Auth forms, Error/404 views
│   └── ui/                      # Reusable Base UI + Tailwind primitives
├── data/
│   ├── products.ts              # 32 curated products (Mobiles, Laptops, Headphones)
│   ├── users.ts                 # Seeded demo Admin & Customer accounts
│   └── seed.ts                  # Database seeder (products, users, verified reviews & ratings)
├── lib/
│   ├── actions/                 # Server Actions (product, cart, order, review, user, admin)
│   ├── prisma.ts                # Singleton Prisma Client with path resolution
│   ├── session.ts               # Request-scoped Auth.js wrapper (`connection()` + `auth()`)
│   ├── utils.ts                 # Persian currency/number formatters & order status metadata
│   └── validator.ts             # Zod v4 schemas
├── prisma/
│   ├── schema.prisma            # Relational schema (Product, User, Cart, Order, Review, Auth models)
│   └── migrations/              # Versioned SQL migrations
├── public/images/               # Local product photography & hero banner assets
├── tests/                       # Unit & DB integration test suites
├── .github/workflows/ci.yml     # Automated CI verification workflow
├── Dockerfile                   # Multi-stage production container build
└── next.config.ts               # Cache Components, image formats & security headers
```

---

## Local Development Setup

### Prerequisites

- **Node.js** `>= 20` (recommended: `22 LTS`)
- **npm** `>= 10`

### 1. Clone & Install

```bash
git clone https://github.com/shadmehress-hub/velora.git
cd velora
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in `AUTH_SECRET`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate a cryptographically random `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection URL (Neon, Supabase, or local PostgreSQL) |
| `DATABASE_URL_UNPOOLED` | Optional | Direct/unpooled PostgreSQL URL used automatically by `prisma migrate deploy` on Neon PgBouncer |
| `AUTH_SECRET` | Yes | Auth.js v5 JWT encryption/signing secret |
| `AUTH_URL` | Yes | Canonical auth base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical URL used for OpenGraph, `robots.txt`, and `sitemap.xml` |
| `GEMINI_API_KEY` | Optional | Enables Gemini Flash review insights (uses built-in analyzer if omitted) |

### 3. Initialize & Seed Database

```bash
npx prisma migrate deploy
npm run db:seed
```

This seeds **32 products**, **2 demo accounts** (defined in [`data/users.ts`](data/users.ts) — admin and standard customer), and **7 sample reviews** with synchronized product ratings.

> **Security Note:** Update or rotate seeded user credentials in [`data/users.ts`](data/users.ts) before exposing a public demo environment.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js 16 Turbopack dev server |
| `npm run build` | Generate Prisma Client, apply pending migrations, seed if DB is empty, and create production build |
| `npm run start` | Start compiled Next.js production server |
| `npm run lint` | Run ESLint across the repository |
| `npm test` | Run unit & database integration tests (`tests/*.test.ts`) |
| `npm run db:migrate` | Apply pending Prisma migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Reset and seed products, demo users, and sample reviews |
| `npm run db:seed:init` | Idempotently seed database only when empty |

---

## Testing & Quality Verification

The project includes **17 automated tests across 8 suites**:

- [`tests/validators.test.ts`](tests/validators.test.ts) — Validates all 32 catalog items, auth rules, cart quantity bounds, Iranian shipping addresses, and review constraints.
- [`tests/utils.test.ts`](tests/utils.test.ts) — Verifies Persian Toman formatting, numeral localization, plain object serialization, and shipping/order constants.
- [`tests/integration.test.ts`](tests/integration.test.ts) — Checks live SQLite connectivity, product/asset disk integrity, password hashing, review aggregation sync, and AI review analysis execution.

Run all checks locally:

```bash
npx tsc --noEmit && npm run lint && npm test && npm run build
```

---

## Production Deployment

### Option A: Vercel + Neon PostgreSQL (Recommended)

1. Provision a free **Neon Postgres** database in **Vercel Storage** (automatically injects `DATABASE_URL` and `DATABASE_URL_UNPOOLED`).
2. Import the GitHub repository into **Vercel** and configure the remaining environment variables:
   - `AUTH_SECRET` (`openssl rand -base64 32`)
   - `AUTH_URL` (`https://your-domain.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` (`https://your-domain.vercel.app`)
   - `GEMINI_API_KEY` *(optional)*
3. Deploy — `npm run build` automatically runs `prisma generate`, applies PostgreSQL migrations via `DATABASE_URL_UNPOOLED || DATABASE_URL`, seeds initial products/reviews if empty, and compiles Next.js 16.

### Option B: Docker / Self-Hosted VPS

A multi-stage [`Dockerfile`](Dockerfile) with `/api/health` liveness probing is included:

```bash
docker build --build-arg DATABASE_URL="postgresql://user:pass@host:5432/velora" -t velora:latest .

docker run -d \
  --name velora \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/velora?sslmode=require" \
  -e AUTH_SECRET="replace-with-32byte-secret" \
  -e AUTH_URL="https://shop.yourdomain.com" \
  -e NEXT_PUBLIC_APP_URL="https://shop.yourdomain.com" \
  velora:latest
```

---

## Health Check

Monitor application and database status anytime at:

```http
GET /api/health
```

Returns `200 OK` with `{"status":"ok","database":"connected","timestamp":"..."}` when healthy, or `500` if the database is unreachable.

---

## License

Built as a portfolio and learning project for modern full-stack e-commerce engineering with Next.js 16.
