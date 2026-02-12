import { z } from 'zod';

export const occasionSchema = z.enum(['brunch', 'coffee', 'gifts', 'catering']).nullable().optional();

export const quoteLineSchema = z.object({
  item_id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unit_price_cents: z.number().int().nonnegative(),
});

export const quoteRequestSchema = z.object({
  location_id: z.string().min(1),
  pickup_mode: z.enum(['asap', 'scheduled']),
  scheduled_pickup_time: z.string().datetime().nullable().optional(),
  occasion: occasionSchema,
  lines: z.array(quoteLineSchema).min(1),
});

export const createOrderRequestSchema = z.object({
  location_id: z.string().min(1),
  pickup_mode: z.enum(['asap', 'scheduled']),
  scheduled_pickup_time: z.string().datetime().nullable().optional(),
  occasion: occasionSchema,
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
  }),
  lines: z.array(quoteLineSchema).min(1),
});
