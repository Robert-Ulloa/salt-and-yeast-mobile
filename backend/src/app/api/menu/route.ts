import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const locationId = request.nextUrl.searchParams.get('locationId');

  if (!locationId) {
    return NextResponse.json({ message: 'locationId is required' }, { status: 400 });
  }

  const items = await prisma.itemAvailability.findMany({
    where: { locationId, isActive: true },
    include: { item: true },
    orderBy: { item: { name: 'asc' } },
  });

  return NextResponse.json({
    location_id: locationId,
    items: items.map((entry) => ({
      id: entry.item.id,
      name: entry.item.name,
      description: entry.item.description,
      image_url: entry.item.imageUrl,
      category: entry.item.category,
      tags: entry.item.tags,
      price_cents: entry.priceCents,
    })),
  });
}
