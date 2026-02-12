import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateQuote } from '@/lib/quote';
import { createOrderRequestSchema } from '@/lib/validation';

function toOrderId() {
  return `ord_${Date.now()}`;
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = createOrderRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Invalid order payload',
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

  const orderId = toOrderId();

  const order = await prisma.order.create({
    data: {
      id: orderId,
      status: 'pending',
      locationId: parsed.data.location_id,
      pickupMode: parsed.data.pickup_mode,
      scheduledPickupTime: parsed.data.scheduled_pickup_time
        ? new Date(parsed.data.scheduled_pickup_time)
        : null,
      occasion: parsed.data.occasion ?? null,
      pickupLabel: quote.pickup_label,
      subtotalCents: quote.subtotal_cents,
      taxCents: quote.tax_cents,
      totalCents: quote.total_cents,
      customerName: parsed.data.contact.name,
      customerEmail: parsed.data.contact.email,
      customerPhone: parsed.data.contact.phone,
      orderItems: {
        create: parsed.data.lines.map((line) => ({
          itemId: line.item_id,
          nameSnapshot: line.name,
          quantity: line.quantity,
          unitPriceCents: line.unit_price_cents,
          lineTotalCents: line.unit_price_cents * line.quantity,
        })),
      },
    },
  });

  return NextResponse.json(
    {
      order_id: order.id,
      status: order.status,
      location_id: order.locationId,
      pickup_mode: order.pickupMode,
      scheduled_pickup_time: order.scheduledPickupTime?.toISOString() ?? null,
      occasion: order.occasion,
      pickup_label: order.pickupLabel,
      subtotal_cents: order.subtotalCents,
      tax_cents: order.taxCents,
      total_cents: order.totalCents,
      created_at: order.createdAt.toISOString(),
    },
    { status: 201 },
  );
}
