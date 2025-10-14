// lib/time.ts
import { addDays as dfAddDays, startOfDay, set, isBefore, isAfter } from 'date-fns';

export const toStartOfDay = (d: Date) => startOfDay(d);
export const addDays = (d: Date, n: number) => dfAddDays(d, n);

// Generera 60-minutersslots mellan 08:00–17:00 (slutet exkluderat)
export function generateHourlySlotsForDay(day: Date) {
  const slots: { start: Date; end: Date }[] = [];
  for (let h = 8; h < 17; h++) {
    const start = set(day, { hours: h, minutes: 0, seconds: 0, milliseconds: 0 });
    const end = set(day, { hours: h + 1, minutes: 0, seconds: 0, milliseconds: 0 });
    slots.push({ start, end });
  }
  return slots;
}

// Överlapp: [s1,e1) överlappar [s2,e2) om s1 < e2 && e1 > s2
export const overlaps = (s1: Date, e1: Date, s2: Date, e2: Date) =>
  isBefore(s1, e2) && isAfter(e1, s2);