import BookClient from "./ui/BookClient";

export const metadata = { title: "Välj en tid" };

export default function BookPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Välj en tid</h1>
      <BookClient />
    </main>
  );
}