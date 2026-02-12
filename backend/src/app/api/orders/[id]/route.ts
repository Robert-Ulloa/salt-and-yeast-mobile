import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  const ageMs = Date.now() - order.createdAt.getTime();
  const derivedStatus =
    ageMs > 180000 ? 'ready' : ageMs > 90000 ? 'preparing' : ageMs > 30000 ? 'confirmed' : 'pending';

  if (order.status !== derivedStatus) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: derivedStatus },
    });
  }

  return NextResponse.json({
    order_id: order.id,
    status: derivedStatus,
    location_id: order.locationId,
    pickup_mode: order.pickupMode,
    scheduled_pickup_time: order.scheduledPickupTime?.toISOString() ?? null,
    occasion: order.occasion,
    pickup_label: order.pickupLabel,
    subtotal_cents: order.subtotalCents,
    tax_cents: order.taxCents,
    total_cents: order.totalCents,
    created_at: order.createdAt.toISOString(),
  });
}
