import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateQuote } from '@/lib/quote';
import { quoteRequestSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = quoteRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Invalid quote payload',
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const quote = await calculateQuote(prisma, {
    locationId: parsed.data.location_id,
    pickupMode: parsed.data.pickup_mode,
    scheduledPickupTime: parsed.data.scheduled_pickup_time ?? null,
    occasion: parsed.data.occasion ?? null,
    lines: parsed.data.lines.map((line) => ({
      itemId: line.item_id,
      name: line.name,
      quantity: line.quantity,
      unitPriceCents: line.unit_price_cents,
    })),
  });

  return NextResponse.json(quote);
}
