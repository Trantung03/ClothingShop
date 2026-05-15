# ClotherShop — E‑commerce Demo

Lightweight full‑stack e‑commerce demo built for learning and portfolio purposes.

## Overview

- Frontend: React + Vite
- Backend: Spring Boot (Java 21) with Maven
- Persistence: JPA/Hibernate (MySQL / compatible RDBMS)

Features
- Product catalog and gallery
- Session-based cart with cart lines (per SKU)
- Inventory reservation on checkout prepare, confirmation on order create
- Prevent oversell via reservation + DB unique constraint on cart items
- Checkout flow with simple validation and modal UX

This repository is intended as a portfolio project for junior/full‑stack developers.

## Quick start (development)

Prerequisites
- Java 21 JDK
- Maven (or use the included `mvnw` wrapper)
- Node.js (16+) and npm
- A running MySQL/Postgres instance (or adjust `application.yml` to an in‑memory DB for quick testing)

Backend

1. Set database connection in `e-commerce_Backend/src/main/resources/application.yml` (spring.datasource.*)
2. From project root, start backend:

```powershell
cd e-commerce_Backend
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'   # Windows example
.\mvnw.cmd spring-boot:run
```

Or build and run:

```bash
cd e-commerce_Backend
.\mvnw.cmd clean package
java -jar target/e-commerce-0.0.1-SNAPSHOT.jar
```

Frontend

```bash
cd clothershopsystem_FE
npm install
npm run dev    # development (Vite)
npm run build  # production build
```

Open the frontend dev server (Vite) URL shown in terminal (default http://localhost:5173 or a nearby port).

## Important endpoints

- `GET /api/cart` — get or create session cart
- `POST /api/cart/addItems` — add item to cart (JSON: `{ skuId, quantity }`)
- `PUT /api/cart/updateItems` — update cart line quantity
- `GET /api/sku/{id}` — get SKU details
- `POST /api/checkout` — prepare checkout (creates inventory reservations)
- `GET /api/checkout/verify/{sessionId}` — verify reservations for a session
- `POST /api/orders` — create order
  - If `paymentMethod=COD`, order will confirm stock immediately and `paymentStatus=PAID`.
  - If `paymentMethod=BANK_TRANSFER`, order is created with `paymentStatus=PENDING`; reservations remain until payment confirmed by admin.
- `POST /api/orders/admin/{orderId}/confirm-payment?paymentReference=REF` — Admin endpoint to mark a bank transfer as paid; it will confirm stock and set `paymentStatus=PAID`.

See source code for controllers in `e-commerce_Backend/src/main/java/com/example/e_commerce/controller/`.

## Notes for reviewers / interview talking points

- Reservation pattern: frontend calls `prepareCheckout()` which reserves available stock for a short period (configurable). Before creating an order the frontend verifies the reservation; backend confirms and decrements SKU stock when order is persisted.
- Concurrency: critical sections lock the SKU row when reserving/confirming stock. A DB unique constraint on `cart_item(cart_id, sku_id)` prevents duplicate lines at the data layer.
- Tradeoffs: `spring.jpa.hibernate.ddl-auto: update` is used for developer convenience; for production use migration scripts (Flyway/Liquibase) are recommended.

## Tests & CI

- The project currently includes build checks (`mvnw clean test-compile`, `npm run build`).
- Recommended improvements before production: add unit tests for reservation/confirm logic, add E2E tests (Playwright), and add GitHub Actions to run builds on PRs.

## Recommended next features (good for portfolio expansion)

- Authentication + user accounts + order history
- Payment integration (Stripe/PayPal sandbox)
- Admin dashboard for inventory and low‑stock alerts
- Deployment with Docker Compose + sample `docker-compose.yml`

## Files to highlight in GitHub PR/README

- `e-commerce_Backend/src/main/java/com/example/e_commerce/service/impl/CartServiceImpl.java` — cart merging & unique constraint handling
- `e-commerce_Backend/src/main/java/com/example/e_commerce/service/impl/InventoryServiceImpl.java` — reservation & confirmation logic
- `clothershopsystem_FE/src/pages/checkout/CheckoutPage.jsx` — checkout flow + reservation verification

## License

This project is provided as‑is for learning and portfolio use. Add an open source license file if you want to publish publicly.

---

If you want, I can also:
- add a short demo GIF and embed it into this README,
- create a `docker-compose.yml` to run both backend and frontend locally,
- or add a GitHub Actions workflow to run builds on push/PR.
