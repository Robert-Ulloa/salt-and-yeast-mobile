# Salt & Yeast Backend MVP

Minimal Next.js + Prisma API for:
- `GET /api/locations`
- `GET /api/menu?locationId=...`
- `POST /api/quote`
- `POST /api/orders`
- `GET /api/orders/:id` (status polling)

## Local setup

1. Copy env file
```bash
cp .env.example .env
```

2. Install deps
```bash
npm install
```

3. Generate Prisma client + run migration + seed
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Start API
```bash
npm run dev
```

Base URL from mobile should be:
- `http://localhost:3000/api` (iOS simulator)
- `http://10.0.2.2:3000/api` (Android emulator)
