import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toStartOfDay, addDays, generateHourlySlotsForDay, overlaps } from '@/lib/time';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start'); // YYYY-MM-DD
    const daysParam = searchParams.get('days');

    const startDate = toStartOfDay(startParam ? new Date(startParam) : new Date());
    const days = Math.max(1, Math.min(7, Number(daysParam ?? 3))); // 1..7

    const rangeStart = startDate;
    const rangeEnd = toStartOfDay(addDays(startDate, days)); // exklusiv

    const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } });
    const bookings = await prisma.booking.findMany({
      where: { start: { lt: rangeEnd }, end: { gt: rangeStart } },
      orderBy: { start: 'asc' },
    });

    const bookingsByRoom = new Map<number, typeof bookings>();
    for (const b of bookings) {
      const arr = bookingsByRoom.get(b.roomId) ?? [];
      arr.push(b);
      bookingsByRoom.set(b.roomId, arr);
    }

    const payload = Array.from({ length: days }, (_, i) => {
      const day = toStartOfDay(addDays(rangeStart, i));
      const slots = generateHourlySlotsForDay(day);
      return {
        date: day.toISOString().slice(0, 10),
        rooms: rooms.map((room) => {
          const roomBookings = bookingsByRoom.get(room.id) ?? [];
          const slotStates = slots.map(({ start, end }) => {
            const isBooked = roomBookings.some((b) => overlaps(start, end, b.start, b.end));
            return { start, end, available: !isBooked };
          });
          return { id: room.id, name: room.name, capacity: room.capacity, slots: slotStates };
        }),
      };
    });

    return NextResponse.json({ start: rangeStart, end: rangeEnd, days: payload });
  } catch (err) {
    console.error('Availability error:', err);
    return NextResponse.json({ error: 'Failed to compute availability' }, { status: 500 });
  }
}