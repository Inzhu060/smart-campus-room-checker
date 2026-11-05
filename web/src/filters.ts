import type { Equipment, Room } from './rooms';

export interface Filters {
  attendees: number;
  equipment: Equipment[];
}

// F1: capacity >= attendees. F2: room has ALL selected equipment items.
export function filterRooms(rooms: Room[], filters: Filters): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= filters.attendees &&
      filters.equipment.every((item) => room.equipment.includes(item)),
  );
}