type Props = {
  top: string;                // ex: "Aida (6)"
  bottom: string;             // ex: "08:00–09:00"
  selected?: boolean;
  onClick?: () => void;
};
export default function SlotButton({ top, bottom, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-pressed={!!selected}
      className={[
        "flex h-16 flex-col justify-center rounded-xl border px-3 py-2 text-[13px] leading-tight",
        selected ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-neutral-50",
      ].join(" ")}
    >
      <span className="font-medium">{top}</span>
      <span className="text-xs text-neutral-600">{bottom}</span>
    </button>
  );
}