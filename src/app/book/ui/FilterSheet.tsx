import type { Room } from "../types";

type Props = {
  open: boolean;
  rooms: Room[];
  draft: number[];
  onToggle(id: number): void;
  onApply(): void;
  onClear(): void;
  onClose(): void;
};

export default function FilterSheet({ open, rooms, draft, onToggle, onApply, onClear, onClose }: Props) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true"
         className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4"
         onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <ul className="space-y-4">
          {rooms.map(r => (
            <li key={r.id} className="flex items-center justify-between">
              <span className="text-[15px]">
                {r.name} <span className="text-neutral-500">({r.capacity} personer)</span>
              </span>
              <input
                type="checkbox"
                className="size-5 accent-black"
                checked={draft.includes(r.id)}
                onChange={() => onToggle(r.id)}
              />
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onApply} className="rounded-2xl bg-black py-3 text-white hover:opacity-90">Välj</button>
          <button onClick={onClear} className="rounded-2xl bg-neutral-800 py-3 text-white hover:opacity-90">Avmarkera</button>
        </div>
      </div>
    </div>
  );
}