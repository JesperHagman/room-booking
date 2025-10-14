import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  addDays,
  fromLocalDateStr,
  generateHourlySlotsForDay,
  localDateStr,
  overlaps,
  toStartOfDay,
} from "@/lib/time";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get("start"); // YYYY-MM-DD (lokalt)
    const daysParam = searchParams.get("days");

    // Default: idag + 2 (totalt 3 dagar)
    const todayLocal = new Date();
    const startDateLocal = startParam ? fromLocalDateStr(startParam) : toStartOfDay(todayLocal);
    const days = Math.max(1, Math.min(7, Number(daysParam ?? 3)));

    const rangeStart = toStartOfDay(startDateLocal);
    const rangeEnd = toStartOfDay(addDays(startDateLocal, days)); // exklusiv

    const rooms = await prisma.room.findMany({ orderBy: { name: "asc" } });

    const bookings = await prisma.booking.findMany({
      where: { start: { lt: rangeEnd }, end: { gt: rangeStart } },
      orderBy: { start: "asc" },
    });

    const bookingsByRoom = new Map<number, typeof bookings>();
    for (const b of bookings) {
      const arr = bookingsByRoom.get(b.roomId) ?? [];
      arr.push(b);
      bookingsByRoom.set(b.roomId, arr);
    }

    const dayObjs = Array.from({ length: days }, (_, i) => toStartOfDay(addDays(rangeStart, i)));

    const payload = dayObjs.map((day) => {
      const slots = generateHourlySlotsForDay(day);
      return {
        date: localDateStr(day),
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

    return NextResponse.json({
      start: localDateStr(rangeStart),
      end: localDateStr(rangeEnd),
      days: payload,
    });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json({ error: "Failed to compute availability" }, { status: 500 });
  }
}