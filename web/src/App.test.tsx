// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

afterEach(cleanup);

const roomButton = (id: string) => screen.queryByRole('button', { name: new RegExp(`Room ${id}`) });

async function chooseRoom(user: ReturnType<typeof userEvent.setup>, id: string) {
  await user.click(screen.getByRole('button', { name: new RegExp(`Room ${id}`) }));
}

async function check(user: ReturnType<typeof userEvent.setup>, start: string, end: string) {
  await user.clear(screen.getByLabelText(/Start/));
  await user.type(screen.getByLabelText(/Start/), start);
  await user.clear(screen.getByLabelText(/End/));
  await user.type(screen.getByLabelText(/End/), end);
  await user.click(screen.getByRole('button', { name: 'Check availability' }));
}

describe('UI behaviour (integration)', () => {
  it('F1+F2: attendees and equipment filters change the room list', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(roomButton('B-202')).not.toBeNull();
    await user.type(screen.getByLabelText('Attendees'), '10');
    await user.click(screen.getByLabelText('Projector'));
    expect(roomButton('A-101')).not.toBeNull();
    expect(roomButton('A-102')).not.toBeNull();
    expect(roomButton('B-201')).not.toBeNull();
    expect(roomButton('B-202')).toBeNull();
  });

  it('F4: shows an empty state when no rooms match', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Attendees'), '100');
    expect(screen.getByText('No rooms match your requirements.')).toBeTruthy();
  });

  it('AC4: touching booking in A-101 is Available', async () => {
    const user = userEvent.setup();
    render(<App />);
    await chooseRoom(user, 'A-101');
    await check(user, '660', '720');
    expect(screen.getByText('Available')).toBeTruthy();
  });

  it('F5: switching the room clears the previous result', async () => {
    const user = userEvent.setup();
    render(<App />);
    await chooseRoom(user, 'A-101');
    await check(user, '660', '720');
    expect(screen.getByText('Available')).toBeTruthy();
    await chooseRoom(user, 'A-102');
    expect(screen.queryByText('Available')).toBeNull();
    expect(screen.queryByText('Unavailable')).toBeNull();
  });

  it('F3: blocked room B-201 is Unavailable', async () => {
    const user = userEvent.setup();
    render(<App />);
    await chooseRoom(user, 'B-201');
    await check(user, '660', '720');
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText('Room B-201 is currently blocked.')).toBeTruthy();
  });

  it('each room uses its own bookings (580-600: busy in A-102, free in A-101)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await chooseRoom(user, 'A-102');
    await check(user, '580', '600');
    expect(screen.getByText('Unavailable')).toBeTruthy();
    await chooseRoom(user, 'A-101');
    await check(user, '580', '600');
    expect(screen.getByText('Available')).toBeTruthy();
  });
});