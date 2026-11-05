export type Result =
  | { status: 'available' }
  | { status: 'unavailable'; reason: string };

export type Booking = [number, number];

export const MAX_DURATION = 120;
export const DAY_END = 1440;

export function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Touching at an endpoint is NOT an overlap (AC4).
export function overlaps(start: number, end: number, bs: number, be: number): boolean {
  return start < be && bs < end;
}

// Validates raw text from the form. Returns an error message or null.
export function validateInput(rawStart: string, rawEnd: string): string | null {
  if (rawStart.trim() === '' || rawEnd.trim() === '') {
    return 'Please enter both Start and End values.';
  }
  if (!/^-?\d+$/.test(rawStart.trim()) || !/^-?\d+$/.test(rawEnd.trim())) {
    return 'Start and End must be whole numbers (minutes after midnight).';
  }
  const start = parseInt(rawStart, 10);
  const end = parseInt(rawEnd, 10);
  if (start < 0 || end < 0) {
    return 'Start and End cannot be negative.';
  }
  if (start > DAY_END || end > DAY_END) {
    return 'Start and End cannot exceed 1440 (24:00).';
  }
  if (start >= end) {
    return 'Start must be earlier than End.';
  }
  return null;
}

// Same rule order and messages as handleCheck() in the original App.tsx.
export function checkAvailability(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  bookings: Booking[],
  roomName = 'Room A-101',
): Result {
  if (blocked) {
    return { status: 'unavailable', reason: `${roomName} is currently blocked.` };
  }
  if (start <= now) {
    return { status: 'unavailable', reason: `Start must be later than the current time (${fmt(now)}).` };
  }
  if (end - start > MAX_DURATION) {
    return { status: 'unavailable', reason: 'Duration cannot exceed 120 minutes.' };
  }
  const clash = bookings.find(([bs, be]) => overlaps(start, end, bs, be));
  if (clash) {
    return {
      status: 'unavailable',
      reason: `Overlaps existing booking ${fmt(clash[0])}–${fmt(clash[1])}.`,
    };
  }
  return { status: 'available' };
}

// Checks availability using the bookings and blocked status of ONE chosen room.
export function checkRoom(
  room: { name: string; blocked: boolean; bookings: Booking[] },
  start: number,
  end: number,
  now: number,
): Result {
  return checkAvailability(start, end, now, room.blocked, room.bookings, room.name);
}