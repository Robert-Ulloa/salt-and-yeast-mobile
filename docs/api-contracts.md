# API Contracts (Mobile <-> Backend)

All money fields are integer cents (`*_cents`).

## GET /locations

### Response 200
```json
{
  "locations": [
    {
      "id": "downtown",
      "name": "Downtown Austin",
      "address": "401 Congress Ave, Austin, TX 78701",
      "hours_label": "Mon-Sun · 7:00 AM - 8:00 PM",
      "is_open_now": true,
      "pickup_eta_mins": 12,
      "tax_rate_bps": 825,
      "image_url": "https://..."
    }
  ]
}
```

## GET /menu?locationId={id}

### Query Params
- `locationId` (required)

### Response 200
```json
{
  "location_id": "downtown",
  "items": [
    {
      "id": "croissant-butter",
      "name": "Cultured Butter Croissant",
      "description": "Laminated daily with Normandy-style cultured butter.",
      "image_url": "https://...",
      "category": "Pastries",
      "tags": ["popular", "bestSeller"],
      "price_cents": 450
    }
  ]
}
```

## POST /quote

### Request
```json
{
  "location_id": "downtown",
  "pickup_mode": "asap",
  "scheduled_pickup_time": null,
  "occasion": "brunch",
  "lines": [
    {
      "item_id": "croissant-butter",
      "name": "Cultured Butter Croissant",
      "quantity": 2,
      "unit_price_cents": 450
    }
  ]
}
```

### Response 200
```json
{
  "location_id": "downtown",
  "pickup_mode": "asap",
  "scheduled_pickup_time": null,
  "occasion": "brunch",
  "pickup_label": "ASAP · 12-18 min",
  "subtotal_cents": 900,
  "tax_cents": 74,
  "total_cents": 974,
  "tax_rate": 0.0825
}
```

## POST /orders

### Request
```json
{
  "location_id": "downtown",
  "pickup_mode": "scheduled",
  "scheduled_pickup_time": "2026-02-12T19:00:00.000Z",
  "occasion": "coffee",
  "contact": {
    "name": "Demo User",
    "email": "demo@saltandyeast.com",
    "phone": "(512) 555-0101"
  },
  "lines": [
    {
      "item_id": "oat-latte",
      "name": "Oat Milk Latte",
      "quantity": 1,
      "unit_price_cents": 550
    }
  ]
}
```

### Response 201
```json
{
  "order_id": "ord_01JXYZ",
  "status": "pending",
  "location_id": "downtown",
  "pickup_mode": "scheduled",
  "scheduled_pickup_time": "2026-02-12T19:00:00.000Z",
  "occasion": "coffee",
  "pickup_label": "Today · 1:00 PM",
  "subtotal_cents": 550,
  "tax_cents": 45,
  "total_cents": 595,
  "created_at": "2026-02-12T18:42:31.201Z"
}
```

## Optional (for status polling)

### GET /orders/:id

### Response 200
```json
{
  "order_id": "ord_01JXYZ",
  "status": "preparing",
  "location_id": "downtown",
  "pickup_mode": "scheduled",
  "scheduled_pickup_time": "2026-02-12T19:00:00.000Z",
  "occasion": "coffee",
  "pickup_label": "Today · 1:00 PM",
  "subtotal_cents": 550,
  "tax_cents": 45,
  "total_cents": 595,
  "created_at": "2026-02-12T18:42:31.201Z"
}
```
