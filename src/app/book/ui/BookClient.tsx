"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { localDateStr, fromLocalDateStr } from "@/lib/time";
import { useRooms } from "../hooks/useRooms";
import { useAvailability } from "../hooks/useAvailability";
import DayColumn from "./DayColumn";
import FilterSheet from "./FilterSheet";
import type { AvailabilityView, SelectedSlot, SlotVM } from "../types";

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
  // datumfönster
  const [startDate, setStartDate] = useState(localDateStr(new Date()));
  const days = 3;

  // rum + filter
  const { rooms } = useRooms();
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRoomsDraft, setSelectedRoomsDraft] = useState<number[]>([]);

  // hämta availability
  const { data, loading } = useAvailability(startDate, days);

  // initiera valda rum när rooms laddats
  useEffect(() => {
    if (rooms.length && selectedRooms.length === 0) {
      const all = rooms.map((r) => r.id);
      setSelectedRooms(all);
      setSelectedRoomsDraft(all);
    }
  }, [rooms, selectedRooms.length]);

  // UI state
  const [selected, setSelected] = useState<SelectedSlot>(null);

  // label uppe i panelen
  const selectedRoomsLabel =
    rooms.length > 0 && selectedRooms.length === rooms.length
      ? "Mötesrum"
      : `${selectedRooms.length} valda rum`;

  // bygg visningsdata per dag (filtrerat + sorterat) → AvailabilityView
  const view: AvailabilityView | null = useMemo(() => {
    if (!data) return null;

    const daysMapped = data.days.map((day) => {
      // ta endast rum som valts och har lediga slots
      const roomsWithAvail = day.rooms
        .filter((r) => selectedRooms.includes(r.id))
        .map((r) => ({ ...r, slots: r.slots.filter((s) => s.available) }))
        .filter((r) => r.slots.length > 0);

      // platta ut och sortera på starttid
      const flatSorted: SlotVM[] = roomsWithAvail
        .flatMap((room) =>
          room.slots.map((s) => ({
            roomId: room.id,
            roomName: room.name,
            capacity: room.capacity,
            start: s.start,
            end: s.end,
          }))
        )
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      return { date: day.date, slots: flatSorted };
    });

    return { start: data.start, end: data.end, days: daysMapped };
  }, [data, selectedRooms]);

  // navigation
  function nextWindow() {
    setStartDate(plusDaysStr(startDate, 3));
    setSelected(null);
  }
  function prevWindow() {
    setStartDate(plusDaysStr(startDate, -3));
    setSelected(null);
  }

  // filter-handlers
  function openFilter() {
    setSelectedRoomsDraft(selectedRooms);
    setFilterOpen(true);
  }
  function toggleDraft(id: number) {
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

  const headerLabel = view?.days?.length
    ? `${fmtDateLabel(view.days[0].date)} – ${fmtDateLabel(
        view.days[view.days.length - 1].date
      )}`
    : "";

  const anySelected = !!selected;

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border">
        {/* Rad 1: filterknapp */}
        <div className="px-4 py-3">
          <button
            onClick={openFilter}
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[15px] shadow-sm"
            aria-haspopup="dialog"
            aria-expanded={filterOpen}
          >
            {selectedRoomsLabel} <span className="text-lg leading-none">▾</span>
          </button>
        </div>

        {/* Rad 2: pilar + datumspann */}
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

        {/* Rad 3: kalender */}
        <div className="px-3 pb-3">
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-3 divide-x-2 divide-neutral-300">
              {view?.days?.map((day) => (
                <DayColumn
                  key={day.date}
                  dateLabel={fmtDateLabel(day.date)}
                  slots={day.slots}
                  selected={selected}
                  onSelect={(s) =>
                    setSelected({ roomId: s.roomId, start: s.start, end: s.end })
                  }
                />
              ))}
            </div>
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

      {/* Filter-sheet */}
      <FilterSheet
        open={filterOpen}
        rooms={rooms}
        draft={selectedRoomsDraft}
        onToggle={toggleDraft}
        onApply={applyDraft}
        onClear={clearDraft}
        onClose={() => setFilterOpen(false)}
      />

      {loading && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-white/60 text-sm">
          Laddar tider…
        </div>
      )}
    </div>
  );
}