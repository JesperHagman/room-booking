import { useEffect, useState } from "react";
import type { Availability } from "../types";

export function useAvailability(start: string, days: number) {
  const [data, setData] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const u = new URL("/api/availability", window.location.origin);
    u.searchParams.set("start", start);
    u.searchParams.set("days", String(days));

    fetch(u.toString(), { cache: "no-store" })
      .then(r => r.json())
      .then((json: Availability) => setData(json))
      .finally(() => setLoading(false));
  }, [start, days]);

  return { data, loading };
}