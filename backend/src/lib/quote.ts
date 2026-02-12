import type { PrismaClient } from '@prisma/client';

type QuoteInput = {
  locationId: string;
  pickupMode: 'asap' | 'scheduled';
  scheduledPickupTime?: string | null;
  occasion?: 'brunch' | 'coffee' | 'gifts' | 'catering' | null;
  lines: Array<{
    itemId: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
  }>;
};

export async function calculateQuote(prisma: PrismaClient, input: QuoteInput) {
  const location = await prisma.location.findUnique({ where: { id: input.locationId } });
  if (!location) {
    throw new Error('Location not found');
  }

  const subtotalCents = input.lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  const taxRate = location.taxRate;
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  const pickupLabel =
    input.pickupMode === 'scheduled'
      ? input.scheduledPickupTime ?? 'Scheduled pickup'
      : `ASAP · ${location.pickupEtaMins}-${location.pickupEtaMins + 6} min`;

  return {
    location_id: input.locationId,
    pickup_mode: input.pickupMode,
    scheduled_pickup_time: input.scheduledPickupTime ?? null,
    occasion: input.occasion ?? null,
    pickup_label: pickupLabel,
    subtotal_cents: subtotalCents,
    tax_cents: taxCents,
    total_cents: totalCents,
    tax_rate: taxRate,
  };
}
