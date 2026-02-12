import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const locations = await prisma.location.findMany({
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({
    locations: locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      hours_label: location.hoursLabel,
      is_open_now: location.isOpenNow,
      pickup_eta_mins: location.pickupEtaMins,
      tax_rate_bps: Math.round(location.taxRate * 10000),
      image_url: location.imageUrl,
    })),
  });
}
