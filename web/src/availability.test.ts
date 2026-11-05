import { describe, it, expect } from 'vitest';
import { checkAvailability, validateInput, type Booking } from './availability';

const NOW = 540;
const BASE: Booking[] = [[600, 660]];
const status = (s: number, e: number, blocked = false, b: Booking[] = BASE, now = NOW) =>
  checkAvailability(s, e, now, blocked, b).status;

describe('AC1: valid time', () => {
  it('start equal to now is unavailable', () => expect(status(540, 570)).toBe('unavailable'));
  it('start one minute after now is available', () => expect(status(541, 570)).toBe('available'));
  it('end exactly 1440 is available', () => expect(status(1380, 1440)).toBe('available'));
});

describe('AC2: 120-minute maximum', () => {
  it('exactly 120 minutes is available', () => expect(status(720, 840)).toBe('available'));
  it('121 minutes is unavailable', () => expect(status(720, 841)).toBe('unavailable'));
});

describe('AC3: blocked room', () => {
  it('blocked room is unavailable even for a valid time', () =>
    expect(status(660, 720, true)).toBe('unavailable'));
});

describe('AC4: overlap rules', () => {
  it('touching end is available', () => expect(status(660, 720)).toBe('available'));
  it('touching start is available', () => expect(status(540, 600, false, BASE, 500)).toBe('available'));
  it('partial overlap is unavailable', () => expect(status(630, 690)).toBe('unavailable'));
  it('request containing a booking is unavailable', () => expect(status(590, 680)).toBe('unavailable'));
  it('booking containing the request is unavailable', () => expect(status(610, 650)).toBe('unavailable'));
  it('overlap with the last of several bookings is unavailable', () =>
    expect(status(820, 850, false, [[600, 660], [700, 760], [800, 860]])).toBe('unavailable'));
});

describe('AC5: result does not change bookings', () => {
  it('bookings array is not modified', () => {
    const bookings: Booking[] = [[700, 760], [600, 660]];
    const before = JSON.stringify(bookings);
    checkAvailability(660, 700, NOW, false, bookings);
    expect(JSON.stringify(bookings)).toBe(before);
  });
});

describe('AC6: validation messages', () => {
  it('empty input gives a message', () => expect(validateInput('', '700')).toMatch(/both/));
  it('non-integer input gives a message', () => expect(validateInput('6.5', '700')).toMatch(/whole numbers/));
  it('negative input gives a message', () => expect(validateInput('-5', '700')).toMatch(/negative/));
  it('value above 1440 gives a message', () => expect(validateInput('1400', '1441')).toMatch(/1440/));
  it('start not earlier than end gives a message', () => expect(validateInput('700', '700')).toMatch(/earlier/));
  it('valid input returns null', () => expect(validateInput('660', '720')).toBeNull());
});