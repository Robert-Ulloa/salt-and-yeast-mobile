# Salt & Yeast Backend Scaffold Plan (Next.js + Prisma + Postgres)

## 1) Suggested Folder Structure

```txt
backend/
  package.json
  .env.example
  prisma/
    schema.prisma
    migrations/
  src/
    app/
      api/
        locations/route.ts          # GET /locations
        menu/route.ts               # GET /menu?locationId=
        quote/route.ts              # POST /quote
        orders/route.ts             # POST /orders
        health/route.ts             # GET /health
    lib/
      db.ts                         # Prisma client singleton
      pricing.ts                    # quote calculations
      validation.ts                 # zod schemas
      errors.ts                     # typed api errors
    modules/
      locations/
        locations.service.ts
      menu/
        menu.service.ts
      orders/
        orders.service.ts
      quotes/
        quote.service.ts
    middleware.ts                   # auth/rate-limit hooks (later)
```

## 2) Prisma Schema (Starter)

```prisma
model Location {
  id            String   @id @default(cuid())
  squareId      String?  @unique
  slug          String   @unique
  name          String
  addressLine1  String
  city          String
  state         String
  postalCode    String
  hoursLabel    String
  isActive      Boolean  @default(true)
  pickupEtaMins Int      @default(15)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  itemAvailability ItemAvailability[]
  orders           Order[]
}

model Item {
  id          String   @id @default(cuid())
  squareId    String?  @unique
  sku         String?  @unique
  name        String
  description String
  imageUrl    String?
  category    String
  basePrice   Int      // store cents
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  availability ItemAvailability[]
  orderItems    OrderItem[]
}

model ItemAvailability {
  id         String   @id @default(cuid())
  locationId String
  itemId     String
  price      Int?
  isAvailable Boolean @default(true)
  updatedAt  DateTime @updatedAt

  location Location @relation(fields: [locationId], references: [id], onDelete: Cascade)
  item     Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([locationId, itemId])
}

model Order {
  id                 String   @id @default(cuid())
  publicOrderNumber  String   @unique
  locationId         String
  status             String   // pending | confirmed | ready | completed | canceled
  pickupMode         String   // asap | scheduled
  pickupAt           DateTime?
  subtotal           Int
  tax                Int
  total              Int
  customerName       String
  customerEmail      String
  customerPhone      String
  externalPaymentId  String?
  externalOrderId    String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  location  Location   @relation(fields: [locationId], references: [id])
  orderItems OrderItem[]
}

model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  itemId      String?
  itemName    String
  quantity    Int
  unitPrice   Int
  lineTotal   Int

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  item  Item? @relation(fields: [itemId], references: [id])
}
```

## 3) Route Contracts

### `GET /locations`
- Returns active locations for mobile selector.

### `GET /menu?locationId=...`
- Returns only available items for the selected location with location-specific price override.

### `POST /quote`
- Input: location, pickup mode/time, line items.
- Output: subtotal, tax, total, pickup label.
- No payment side effects.

### `POST /orders`
- Input: validated order payload.
- Output: created order id/status/quote snapshot.
- For now: create internal order only.
- Later: call Square Orders/Payments inside server layer.

## 4) Required Environment Variables

```bash
NODE_ENV=development
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_ENV=local
API_TAX_RATE=0.0825
API_DEFAULT_TIMEOUT_MS=8000
ORDER_NUMBER_PREFIX=SY

# future square integration
SQUARE_ENV=sandbox
SQUARE_APPLICATION_ID=
SQUARE_ACCESS_TOKEN=
SQUARE_WEBHOOK_SIGNATURE_KEY=
```

## 5) Notes for Future Square Integration (Not Implemented Yet)
- Keep all Square tokens and payment calls server-side only.
- Extend `orders.service.ts` to map internal orders to Square orders.
- Add webhook ingestion routes under `api/webhooks/square/*` once enabled.
