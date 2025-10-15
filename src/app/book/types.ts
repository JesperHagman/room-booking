export type Room = { id: number; name: string; capacity: number };

export type Slot = { start: string; end: string; available: boolean };

export type DayRooms = {
  date: string;
  rooms: { id: number; name: string; capacity: number; slots: Slot[] }[];
};

export type Availability = { start: string; end: string; days: DayRooms[] };

// Vald slot i UI:t
export type SelectedSlot = { roomId: number; start: string; end: string } | null;

// "View model" för renderingen (platt lista per dag, utan rooms)
export type SlotVM = {
  roomId: number;
  roomName: string;
  capacity: number;
  start: string;
  end: string;
};

export type DayView = { date: string; slots: SlotVM[] };

export type AvailabilityView = { start: string; end: string; days: DayView[] };