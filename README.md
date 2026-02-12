# Salt & Yeast

React Native + Expo mobile app with a minimal Next.js + Prisma backend MVP.

## Project Structure

- `src/` mobile app (Expo, Zustand, network-shaped API layer)
- `backend/` Next.js App Router API + Prisma + Postgres scaffolding
- `docs/api-contracts.md` locked mobile/backend JSON contracts
- `docs/backend-scaffold-plan.md` backend architecture notes

## Required Environment Variables

### Mobile (`salt-and-yeast-mobile`)

- `EXPO_PUBLIC_API_URL`
  - Optional. If missing, app uses local mock fallback.
  - Example for iOS simulator: `http://localhost:3000/api`
  - Example for Android emulator: `http://10.0.2.2:3000/api`

### Backend (`backend/.env`)

- `DATABASE_URL`
  - Neon/Postgres connection string
- `API_TAX_RATE_DEFAULT`
  - fallback tax rate, e.g. `0.0825`

## Local Development

### 1) Start backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 2) Start mobile

```bash
cd ..
npm install
export EXPO_PUBLIC_API_URL=http://localhost:3000/api
npx expo start --clear
```

If you skip `EXPO_PUBLIC_API_URL`, the app runs fully in mock mode.

## Deployment Readiness Checklist

### Mobile

- [ ] Set `EXPO_PUBLIC_API_URL` per environment (dev/staging/prod)
- [ ] Configure EAS build profiles
- [ ] Confirm iOS/Android app signing and release channels
- [ ] Verify API error handling in low-network conditions

### Backend

- [ ] Provision Neon Postgres and set `DATABASE_URL`
- [ ] Run Prisma migrations in target environment
- [ ] Seed baseline locations/items/item availability
- [ ] Set environment variables in hosting provider
- [ ] Add logging + monitoring + alerting
- [ ] Add rate limiting before public launch

### Product / Integrations (next phase)

- [ ] Add auth (session + customer identity)
- [ ] Add Square order/payment integration server-side only
- [ ] Add webhook ingestion (`orders`, `payments`, `catalog`, `loyalty`)
