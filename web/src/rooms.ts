import type { Booking } from './availability';

export type Equipment = 'Projector' | 'Whiteboard' | 'Video conferencing' | 'Computers';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: Equipment[];
  blocked: boolean;
  bookings: Booking[];
}

// Fixed "current time" for the demo (09:00), same as in the original prototype.
export const NOW = 540;

export const ALL_EQUIPMENT: Equipment[] = [
  'Projector',
  'Whiteboard',
  'Video conferencing',
  'Computers',
];

// Fictional data only.
export const ROOMS: Room[] = [
  {
    id: 'A-101',
    name: 'Room A-101',
    capacity: 10,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [[600, 660]],
  },
  {
    id: 'A-102',
    name: 'Room A-102',
    capacity: 25,
    equipment: ['Projector', 'Whiteboard', 'Video conferencing'],
    blocked: false,
    bookings: [[570, 630], [720, 780]],
  },
  {
    id: 'B-201',
    name: 'Room B-201',
    capacity: 40,
    equipment: ['Projector', 'Computers', 'Video conferencing'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'B-202',
    name: 'Room B-202',
    capacity: 6,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [[600, 720]],
  },
];