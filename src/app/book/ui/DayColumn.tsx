import SlotButton from "./SlotButton";
import type { SlotVM, SelectedSlot } from "../types";

type Props = {
  dateLabel: string;     // "16 okt"
  slots: SlotVM[];       // redan filtrerad & sorterad per dag
  selected: SelectedSlot;
  onSelect: (s: SlotVM) => void;
};

export default function DayColumn({ dateLabel, slots, selected, onSelect }: Props) {
  return (
    <div className="p-3">
      <div className="sticky top-0 z-10 mb-3">
        <div className="mx-auto w-full rounded-lg border bg-white px-3 py-1.5 text-center text-sm font-medium text-neutral-800">
          {dateLabel}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {slots.length === 0 && <div className="text-xs text-neutral-400">Inga lediga tider</div>}
        {slots.map((slot, i) => {
          const isSel = selected?.roomId === slot.roomId &&
                        selected?.start === slot.start &&
                        selected?.end === slot.end;
          return (
            <SlotButton
              key={`${slot.roomId}-${i}`}
              selected={isSel}
              onClick={() => onSelect(slot)}
              top={`${slot.roomName} (${slot.capacity})`}
              bottom={`${new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}–${new Date(slot.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            />
          );
        })}
      </div>
    </div>
  );
}