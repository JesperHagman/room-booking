"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Room = { id: number; name: string; capacity: number };

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString([], { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function ConfirmClient(props: {
  roomId: string;
  start: string;
  end: string;
}) {
  const router = useRouter();
  const roomIdNum = Number(props.roomId);

  // visa lite sammanfattning
  const startFmt = useMemo(() => fmtDateTime(props.start), [props.start]);
  const endFmt = useMemo(() => fmtDateTime(props.end), [props.end]);

  // hämta rum-namn för headern
  const [room, setRoom] = useState<Room | null>(null);
  useEffect(() => {
    fetch("/api/rooms", { cache: "no-store" })
      .then((r) => r.json())
      .then((rooms: Room[]) =>
        setRoom(rooms.find((x) => x.id === roomIdNum) ?? null)
      )
      .catch(() => setRoom(null));
  }, [roomIdNum]);

  // formulär
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // auto redirect countdown
  const [countdown, setCountdown] = useState(10);

  async function submit() {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomIdNum,
          booker: name.trim(),
          start: props.start,
          end: props.end,
        }),
      });

      if (res.ok) {
        setSuccessOpen(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err?.error ?? "Kunde inte genomföra bokningen");
      }
    } catch (e) {
      setErrorMsg("Nätverksfel. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  // auto redirect när bokning lyckas
  useEffect(() => {
    if (!successOpen) return;

    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [successOpen, router]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4">
        <label className="mb-2 block text-sm text-neutral-700">
          Förnamn och efternamn
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skriv ditt fullständiga namn här"
          className="w-full rounded-xl border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-black/20"
        />

        <div className="mt-4 text-sm text-neutral-700">
          <div>
            Rum:{" "}
            <span className="font-medium">{room?.name ?? `#${roomIdNum}`}</span>
          </div>
          <div>
            Datum: <span className="font-medium">{startFmt.date}</span>
          </div>
          <div>
            Tid:{" "}
            <span className="font-medium">
              {startFmt.time} – {endFmt.time}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        onClick={submit}
        disabled={!name.trim() || saving}
        className={[
          "w-full rounded-full bg-black py-3 text-white",
          !name.trim() || saving ? "opacity-40" : "hover:opacity-90",
        ].join(" ")}
      >
        {saving ? "Bokar…" : "Boka"}
      </button>

      {/* Bekräftelse-overlay */}
      {successOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-xl">
            <div className="mb-1 text-sm text-neutral-600">
              Ditt rum är bokat!
            </div>
            <div className="mb-3 text-xs text-neutral-500">
              Du skickas till startsidan om {countdown}s …
            </div>
            <button
              onClick={() => router.push("/")}
              className="mt-2 w-full rounded-full bg-black py-2.5 text-white hover:opacity-90"
            >
              Klart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}