import { describe, it, expect } from 'vitest';
import { ROOMS } from './rooms';
import type { Room } from './rooms';
import { filterRooms } from './filters';
import { checkRoom } from './availability';

const NOW = 540;
const ids = (rooms: Room[]) => rooms.map((r) => r.id);
const room = (id: string) => ROOMS.find((r) => r.id === id)!;

describe('Room catalog', () => {
  it('has at least four rooms', () => expect(ROOMS.length).toBeGreaterThanOrEqual(4));
  it('every room has id, name, capacity, equipment, blocked flag and bookings', () => {
    for (const r of ROOMS) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.capacity).toBeGreaterThan(0);
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(typeof r.blocked).toBe('boolean');
      expect(Array.isArray(r.bookings)).toBe(true);
    }
  });
});

describe('F1: capacity filter', () => {
  it('exact capacity is included', () =>
    expect(ids(filterRooms(ROOMS, { attendees: 10, equipment: [] }))).toEqual(['A-101', 'A-102', 'B-201']));
  it('insufficient capacity is excluded', () =>
    expect(ids(filterRooms(ROOMS, { attendees: 11, equipment: [] }))).toEqual(['A-102', 'B-201']));
});

describe('F2: equipment filter', () => {
  it('room must contain ALL selected items', () =>
    expect(ids(filterRooms(ROOMS, { attendees: 1, equipment: ['Projector', 'Video conferencing'] }))).toEqual(['A-102', 'B-201']));
  it('one selected item matches every room that has it', () =>
    expect(ids(filterRooms(ROOMS, { attendees: 1, equipment: ['Projector'] }))).toEqual(['A-101', 'A-102', 'B-201']));
});

describe('F4: empty result', () => {
  it('impossible capacity gives an empty list', () =>
    expect(filterRooms(ROOMS, { attendees: 100, equipment: [] })).toEqual([]));
  it('impossible equipment combination gives an empty list', () =>
    expect(filterRooms(ROOMS, { attendees: 1, equipment: ['Computers', 'Whiteboard'] })).toEqual([]));
});

describe('Combined filters', () => {
  it('capacity and equipment together', () =>
    expect(ids(filterRooms(ROOMS, { attendees: 30, equipment: ['Computers'] }))).toEqual(['B-201']));
});

describe('F3: blocked room', () => {
  it('blocked room is unavailable even at a free time', () => {
    const result = checkRoom(room('B-201'), 660, 720, NOW);
    expect(result.status).toBe('unavailable');
  });
});

describe('F5: availability uses the chosen room bookings', () => {
  it('same time is free in A-101 but busy in A-102', () => {
    expect(checkRoom(room('A-101'), 580, 600, NOW).status).toBe('available');
    expect(checkRoom(room('A-102'), 580, 600, NOW).status).toBe('unavailable');
  });
  it('same time touches in A-101 (free) but overlaps in B-202 (busy)', () => {
    expect(checkRoom(room('A-101'), 660, 720, NOW).status).toBe('available');
    expect(checkRoom(room('B-202'), 660, 720, NOW).status).toBe('unavailable');
  });
});