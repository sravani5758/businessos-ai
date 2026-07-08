# BusinessOS Core Engine (`@businessos/core`)

## Purpose

BusinessOS Core Engine is the **central business logic layer** ("the brain") of
BusinessOS AI. It contains **zero frontend code** and **zero framework
dependencies** (no React, no Express, no MongoDB) — it's a plain
TypeScript/Node.js module that models how a real business actually operates:

```
Customer buys products
    ↓
Inventory decreases
    ↓
Revenue increases
    ↓
Invoice created
    ↓
Analytics updated
    ↓
AI receives latest data
    ↓
Dashboard updates (future — frontend layer)
```

It is designed to be imported as-is into a backend later:

```ts
import { createOrder, calculateRevenue, generateBusinessSummary } from "@businessos/core";
```

## Folder Structure

```
packages/business-core/
├── src/
│   ├── models/       Type definitions for every business entity
│   │                 (Business, Product, Customer, Employee, Supplier, Order, Expense)
│   ├── services/      Business operations: inventory, customers, employees,
│   │                 orders (the core buy-flow), expenses
│   ├── analytics/     Pure functions that derive insight from raw data:
│   │                 revenue, profit, growth, top/worst sellers, sales trends
│   ├── reports/       Structured JSON report generators built on top of
│   │                 services + analytics (sales, inventory, expense,
│   │                 employee, customer reports)
│   ├── ai/            Data-shaping helpers that prepare
│   │                 summary/recommendation JSON for a future LLM layer
│   │                 (no external AI calls yet — that's intentional)
│   ├── utils/         Small pure helpers: currency/date formatting, id
│   │                 generation, percentage/tax/discount math
│   ├── constants/     Shared enums: Roles, Categories, PaymentMethods,
│   │                 OrderStatus, ExpenseCategories
│   ├── data/          Deterministic sample dataset (100 products, 50
│   │                 customers, 20 employees, 500 orders, 100 expenses,
│   │                 15 suppliers, 1 sample business)
│   ├── demo.ts        Runnable script that exercises the full
│   │                 buy → inventory → revenue → invoice → analytics → AI flow
│   ├── demo.test.ts   Lightweight assertion-based test suite (no test
│   │                 framework dependency — uses Node's built-in `assert`)
│   └── index.ts       Public entry point — re-exports everything
├── package.json
├── tsconfig.json
└── README.md
```

> Note: `index.ts` lives at `src/index.ts` rather than the package root, which
> is the standard TypeScript convention (it's what `tsconfig.json`'s
> `rootDir`/`outDir` compiles from). After `npm run build`, the compiled
> `dist/index.js` is what `package.json`'s `main` field points to, so
> consumers importing `@businessos/core` don't need to know this detail.

## Installation

```bash
cd packages/business-core
npm install
```

This installs the only dependencies the package needs — all **dev**
dependencies, since the compiled output has no runtime dependencies at all:
`typescript`, `ts-node`, `@types/node`, `rimraf`.

## Running / Testing — Step by Step

### 1. Run the interactive demo (recommended first step)

This runs the exact flow from the assignment end-to-end and prints the
results to your terminal — no setup beyond `npm install` needed.

```bash
npm run dev
```

You should see output like:

```
============================================================
2. CUSTOMER BUYS PRODUCTS (createOrder)
============================================================
Before purchase -> "Basmati Rice 5kg" stock: 84
Order created: ord_xxxxx, total: ₹850.00
After purchase  -> "Basmati Rice 5kg" stock: 82 (inventory decreased ✅)
...
```

This proves the whole chain works: `createOrder()` → stock goes down →
`order.total` (revenue) is calculated → `generateInvoice()` produces a
structured invoice → `generateSalesReport()` picks up the new order →
`generateBusinessSummary()` (AI module) reflects it.

### 2. Run the automated test suite

```bash
npm test
```

This runs `src/demo.test.ts`, which checks ~30 behaviors across every
module (sample data counts, stock math, order creation/cancellation,
invoice totals, analytics, reports, AI summaries, utility functions) using
Node's built-in `assert`. It prints a ✅/❌ per test and a final tally, and
exits with a non-zero code if anything fails (so it also works in CI).

Expected final line:

```
RESULTS: 30 passed, 0 failed (30 total)
```

### 3. Type-check & build to plain JavaScript

```bash
npm run build
```

This runs `tsc` and outputs compiled `.js` + `.d.ts` files to `dist/`. Run
this to confirm there are zero TypeScript errors, and to produce the
artifact a backend would actually `require`/`import`.

### 4. Try it in your own script

Create a scratch file, e.g. `src/playground.ts`:

```ts
import { sampleProducts, sampleOrders, sampleCustomers, createOrder, generateSalesReport } from "./index";

const products = sampleProducts.map((p) => ({ ...p })); // copy so sample data isn't mutated
const orders = sampleOrders.map((o) => ({ ...o }));

const order = createOrder(orders, products, {
  customerId: sampleCustomers[0].id,
  paymentMethod: "Cash",
  items: [{ productId: products[0].id, quantity: 1 }],
});

console.log(order);
console.log(generateSalesReport(orders).totalRevenue);
```

Run it with:

```bash
npx ts-node src/playground.ts
```

## Coding Standards Followed

- TypeScript only, `strict` mode enabled.
- Small, single-purpose, reusable functions.
- Services take the data array (`products[]`, `orders[]`, etc.) as an
  explicit parameter rather than holding hidden global state — this keeps
  the package storage-agnostic. A backend can later swap plain arrays for
  MongoDB-backed arrays/queries without touching this business logic.
- No duplicate logic — e.g. stock changes always go through
  `increaseStock`/`decreaseStock`, never mutated directly elsewhere.
- Every exported function has a short comment explaining intent.

## Future Integration

This package intentionally has no knowledge of:

- **Frontend** — Dashboard, Inventory UI, Customers UI, Finance UI, Employees UI, AI Assistant UI, Reports UI
- **Backend infra** — Express API, Authentication, MongoDB, Gemini AI, Cloudinary, Notifications

When those layers exist, the flow becomes:

```
Business Owner → BusinessOS Frontend → Express Backend → BusinessOS Core Engine
    → Database → Analytics → AI Insights → Dashboard
```

The Express backend will `import` this package, wire its services to real
MongoDB documents, and expose the same functions (`createOrder`,
`calculateRevenue`, `generateBusinessSummary`, etc.) over HTTP routes.
