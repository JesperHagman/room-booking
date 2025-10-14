"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { localDateStr, fromLocalDateStr } from "@/lib/time";

type Room = { id: number; name: string; capacity: number };
type Slot = { start: string; end: string; available: boolean };
type DayRooms = {
  date: string;
  rooms: { id: number; name: string; capacity: number; slots: Slot[] }[];
};
type Availability = { start: string; end: string; days: DayRooms[] };

function fmtTime(s: string) {
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDateLabel(iso: string) {
  const d = fromLocalDateStr(iso);
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}
function plusDaysStr(iso: string, n: number) {
  const d = fromLocalDateStr(iso);
  d.setDate(d.getDate() + n);
  return localDateStr(d);
}

export default function BookClient() {
  // start = idag (lokalt), fönster = 3 dagar (0,1,2)
  const [startDate, setStartDate] = useState<string>(localDateStr(new Date()));
  const [days] = useState<number>(3);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  // draft i panel (appl. först när man trycker Välj)
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRoomsDraft, setSelectedRoomsDraft] = useState<number[]>([]);

  const [data, setData] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<{
    roomId: number;
    start: string;
    end: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/rooms", { cache: "no-store" })
      .then((r) => r.json())
      .then((list: Room[]) => {
        setRooms(list);
        const all = list.map((x) => x.id);
        setSelectedRooms(all);
        setSelectedRoomsDraft(all);
      });
  }, []);

  // hämta availability när startDate ändras
  useEffect(() => {
    setLoading(true);
    const u = new URL("/api/availability", window.location.origin);
    u.searchParams.set("start", startDate); // lokalt YYYY-MM-DD
    u.searchParams.set("days", String(days));
    fetch(u.toString(), { cache: "no-store" })
      .then((r) => r.json())
      .then((json: Availability) => setData(json))
      .finally(() => setLoading(false));
  }, [startDate, days]);

  // klientfilter mot redan hämtad data
  const filtered = useMemo<Availability | null>(() => {
    if (!data) return null;
    const d = data.days.map((day) => ({
      ...day,
      rooms: day.rooms.filter((r) => selectedRooms.includes(r.id)),
    }));
    return { ...data, days: d };
  }, [data, selectedRooms]);

  // rubriken i mitten “14 okt – 16 okt”
  const headerLabel = (() => {
    if (!data) return "";
    const start = fmtDateLabel(data.days[0].date);
    const end = fmtDateLabel(data.days[data.days.length - 1].date);
    return `${start} – ${end}`;
  })();

  // pilar +3 / -3 dagar
  function nextWindow() {
    setStartDate(plusDaysStr(startDate, 3));
    setSelected(null);
  }
  function prevWindow() {
    setStartDate(plusDaysStr(startDate, -3));
    setSelected(null);
  }

  // filterpanel
  function openFilter() {
    setSelectedRoomsDraft(selectedRooms);
    setFilterOpen(true);
  }
  function toggleDraft(id: number) {
    setSelected(null);
    setSelectedRoomsDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function applyDraft() {
    setSelectedRooms(selectedRoomsDraft);
    setFilterOpen(false);
  }
  function clearDraft() {
    setSelectedRoomsDraft([]);
  }

  const anySelected = !!selected;
  const selectedRoomsLabel =
    rooms.length > 0 && selectedRooms.length === rooms.length
      ? "Mötesrum"
      : `${selectedRooms.length} valda rum`;

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border">
        {/* Rad 1: ENDA knappen för filter (Mötesrum) */}
        <div className="px-4 py-3">
          <button
            onClick={openFilter}
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[15px] shadow-sm"
            aria-haspopup="dialog"
            aria-expanded={filterOpen}
          >
            {selectedRoomsLabel}
            <span className="text-lg leading-none">▾</span>
          </button>
        </div>

        {/* Rad 2: Datumspann + pilar */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <button
            onClick={prevWindow}
            className="grid size-9 place-items-center rounded-full border text-lg hover:bg-neutral-50"
            aria-label="Föregående"
          >
            ←
          </button>

          <div className="text-sm text-neutral-700">{headerLabel}</div>

          <button
            onClick={nextWindow}
            className="grid size-9 place-items-center rounded-full border text-lg hover:bg-neutral-50"
            aria-label="Nästa"
          >
            →
          </button>
        </div>

        {/* 3 kolumner med egna ramar */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-3">
            {filtered?.days?.map((day) => (
              <div key={day.date} className="rounded-2xl border p-3">
                <div className="mb-2 text-sm font-medium">{fmtDateLabel(day.date)}</div>
                <div className="space-y-3">
                  {day.rooms.map((room) => (
                    <div key={room.id}>
                      <div className="mb-1 text-xs text-neutral-600">{room.name}</div>
                      <div className="flex flex-col gap-2">
                        {room.slots.map((s, i) => {
                          const isSel =
                            selected?.roomId === room.id &&
                            selected?.start === s.start &&
                            selected?.end === s.end;
                          const disabled = !s.available;
                          return (
                            <button
                              key={i}
                              disabled={disabled}
                              onClick={() => setSelected({ roomId: room.id, start: s.start, end: s.end })}
                              aria-pressed={isSel}
                              className={[
                                "h-10 rounded-xl border px-4 text-[13px]",
                                "text-left",
                                "disabled:opacity-40 disabled:cursor-not-allowed",
                                isSel ? "bg-emerald-600 text-white border-emerald-600" : "bg-white",
                              ].join(" ")}
                            >
                              {fmtTime(s.start)}–{fmtTime(s.end)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nästa-knapp */}
      <div className="pt-1">
        <Link
          href={
            anySelected
              ? `/book/confirm?roomId=${selected!.roomId}&start=${encodeURIComponent(
                  selected!.start
                )}&end=${encodeURIComponent(selected!.end)}`
              : "#"
          }
          aria-disabled={!anySelected}
          className={[
            "block w-full rounded-full bg-black py-3 text-center text-white",
            !anySelected ? "pointer-events-none opacity-40" : "hover:opacity-90",
          ].join(" ")}
        >
          Nästa
        </Link>
      </div>

      {/* Filter-panel */}
      {filterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4">
              {rooms.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <span className="text-[15px]">
                    {r.name} <span className="text-neutral-500">({r.capacity} personer)</span>
                  </span>
                  <input
                    type="checkbox"
                    className="size-5 accent-black"
                    checked={selectedRoomsDraft.includes(r.id)}
                    onChange={() => toggleDraft(r.id)}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={applyDraft}
                className="rounded-2xl bg-black py-3 text-white hover:opacity-90"
              >
                Välj
              </button>
              <button
                onClick={clearDraft}
                className="rounded-2xl bg-neutral-800 py-3 text-white hover:opacity-90"
              >
                Avmarkera
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-white/60 text-sm">
          Laddar tider…
        </div>
      )}
    </div>
  );
}