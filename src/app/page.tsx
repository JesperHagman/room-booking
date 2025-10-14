// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col px-6 pt-12 pb-6">
      {/* Stor rubrik som i Figma */}
      <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight">
        Boka ett<br />rum
      </h1>

      {/* Knapp längst ned (som i skissen) */}
      <div className="mt-auto pb-[env(safe-area-inset-bottom)]">
        <Link
          href="/book"
          className="block w-full rounded-full bg-black py-3 text-center text-white transition-opacity hover:opacity-90"
        >
          Boka
        </Link>
      </div>
    </main>
  );
}