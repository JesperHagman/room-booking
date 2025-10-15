import { useEffect, useState } from "react";
import type { Room } from "../types";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/rooms", { cache: "no-store" })
      .then(r => r.json())
      .then((list: Room[]) => setRooms(list))
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading };
}