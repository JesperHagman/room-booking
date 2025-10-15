// src/app/book/confirm/page.tsx
import ConfirmClient from "../ui/ConfirmClient";

export const metadata = { title: "Vem bokar?" };

type Props = {
  searchParams: { roomId?: string; start?: string; end?: string };
};

export default function ConfirmPage({ searchParams }: Props) {
  const { roomId, start, end } = searchParams;

  // Minimal guard – om något saknas, visa enkel info + länk tillbaka
  if (!roomId || !start || !end) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-6">
        <h1 className="mb-4 text-2xl font-semibold">Vem bokar?</h1>
        <div className="rounded-2xl border p-4">
          <p className="mb-4 text-sm">
            Saknas data för bokningen. Gå tillbaka och välj en tid.
          </p>
          <a
            href="/book"
            className="inline-block rounded-full bg-black px-4 py-2 text-white"
          >
            Tillbaka
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Vem bokar?</h1>
      <ConfirmClient roomId={roomId} start={start} end={end} />
    </main>
  );
}