import { addDays as dfAddDays, startOfDay, set, isBefore, isAfter } from "date-fns";

/** YYYY-MM-DD i LOKALTID utan UTC-konvertering */
export function localDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Bygg Date i LOKALTID från 'YYYY-MM-DD' */
export function fromLocalDateStr(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m as number) - 1, d); // lokal midnatt
}

export const toStartOfDay = (d: Date) => startOfDay(d);
export const addDays = (d: Date, n: number) => dfAddDays(d, n);

// 60-minutersslotar 08–17 (slut exkl.)
export function generateHourlySlotsForDay(day: Date) {
  const slots: { start: Date; end: Date }[] = [];
  for (let h = 8; h < 17; h++) {
    const start = set(day, { hours: h, minutes: 0, seconds: 0, milliseconds: 0 });
    const end = set(day, { hours: h + 1, minutes: 0, seconds: 0, milliseconds: 0 });
    slots.push({ start, end });
  }
  return slots;
}

export const overlaps = (s1: Date, e1: Date, s2: Date, e2: Date) =>
  isBefore(s1, e2) && isAfter(e1, s2);