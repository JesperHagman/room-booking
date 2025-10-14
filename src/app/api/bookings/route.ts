import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [s1,e1) överlappar [s2,e2) om s1 < e2 && e1 > s2
function overlaps(s1: Date, e1: Date, s2: Date, e2: Date) {
  return s1 < e2 && e1 > s2;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1) Grundvalidering (minimal, tydlig)
    const roomId = Number(body?.roomId);
    const booker = (body?.booker ?? '').toString().trim();
    const start = body?.start ? new Date(body.start) : null;
    const end = body?.end ? new Date(body.end) : null;

    if (!roomId || !booker || !start || !end) {
      return NextResponse.json(
        { error: 'roomId, booker, start och end krävs' },
        { status: 400 }
      );
    }
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Ogiltigt datumformat' }, { status: 400 });
    }
    if (!(start < end)) {
      return NextResponse.json({ error: 'start måste vara före end' }, { status: 400 });
    }

    // 2) Finns rummet?
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: 'Rum finns inte' }, { status: 404 });
    }

    // 3) Konfliktkontroll (överlappande bokningar)
    //   Hitta första bokning som överlappar intervallet
    const conflicting = await prisma.booking.findFirst({
      where: {
        roomId,
        start: { lt: end }, // existing.start < new.end
        end: { gt: start }, // existing.end   > new.start
      },
      select: { id: true, start: true, end: true },
    });

    if (conflicting) {
      return NextResponse.json(
        {
          error: 'Tidsintervallet är redan bokat',
          conflict: conflicting,
        },
        { status: 409 }
      );
    }

    // 4) Skapa bokningen
    const created = await prisma.booking.create({
      data: { roomId, start, end, booker },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}