import { useMemo, useState } from 'react';
import { Clock, Lock, Unlock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type Result =
  | { status: 'available' }
  | { status: 'unavailable'; reason: string }
  | null;

const NOW = 540;
const BOOKINGS: [number, number][] = [[600, 660]];

function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function overlaps(start: number, end: number, bs: number, be: number): boolean {
  return start < be && bs < end;
}

function validate(rawStart: string, rawEnd: string): string | null {
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
  if (start > 1440 || end > 1440) {
    return 'Start and End cannot exceed 1440 (24:00).';
  }
  if (start >= end) {
    return 'Start must be earlier than End.';
  }
  return null;
}

export default function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);

  const activeBookings = useMemo(
    () => BOOKINGS.filter(([bs, be]) => be > NOW).sort((a, b) => a[0] - b[0]),
    []
  );

  function reset() {
    setResult(null);
    setError(null);
  }

  function handleCheck() {
    const vErr = validate(start, end);
    if (vErr) {
      setError(vErr);
      setResult(null);
      return;
    }
    setError(null);
    const s = parseInt(start, 10);
    const e = parseInt(end, 10);

    if (blocked) {
      setResult({ status: 'unavailable', reason: 'Room A-101 is currently blocked.' });
      return;
    }
    if (s <= NOW) {
      setResult({ status: 'unavailable', reason: `Start must be later than the current time (${fmt(NOW)}).` });
      return;
    }
    if (e - s > 120) {
      setResult({ status: 'unavailable', reason: 'Duration cannot exceed 120 minutes.' });
      return;
    }
    const clash = BOOKINGS.find(([bs, be]) => overlaps(s, e, bs, be));
    if (clash) {
      setResult({
        status: 'unavailable',
        reason: `Overlaps existing booking ${fmt(clash[0])}–${fmt(clash[1])}.`,
      });
      return;
    }
    setResult({ status: 'available' });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20 mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Smart Campus Room Availability</h1>
          <p className="text-sm text-slate-500 mt-1">Checking only — no bookings are created or modified.</p>
        </header>

        {/* Room card */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Room A-101</h2>
              <p className="text-xs text-slate-500 mt-0.5">Current time: {fmt(NOW)} (minute 540)</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                blocked ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              }`}
            >
              {blocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {blocked ? 'Blocked' : 'Open'}
            </span>
          </div>

          {/* Block switch */}
          <label className="mt-4 flex items-center justify-between cursor-pointer select-none">
            <span className="text-sm font-medium text-slate-700">Room blocked</span>
            <button
              type="button"
              role="switch"
              aria-checked={blocked}
              onClick={() => { setBlocked((b) => !b); reset(); }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                blocked ? 'bg-rose-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  blocked ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          {/* Existing bookings */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Existing bookings</p>
            {activeBookings.length === 0 ? (
              <p className="text-sm text-slate-400">None for the rest of the day.</p>
            ) : (
              <ul className="space-y-1.5">
                {activeBookings.map(([bs, be], i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="font-medium">{fmt(bs)} – {fmt(be)}</span>
                    <span className="text-slate-400">({be - bs} min)</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Input card */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start" className="block text-xs font-medium text-slate-600 mb-1.5">
                Start <span className="text-slate-400">(min)</span>
              </label>
              <input
                id="start"
                inputMode="numeric"
                value={start}
                onChange={(e) => { setStart(e.target.value); reset(); }}
                placeholder="e.g. 660"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-xs font-medium text-slate-600 mb-1.5">
                End <span className="text-slate-400">(min)</span>
              </label>
              <input
                id="end"
                inputMode="numeric"
                value={end}
                onChange={(e) => { setEnd(e.target.value); reset(); }}
                placeholder="e.g. 720"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Whole minutes after midnight. 0–1440. Max 120 min. Start must be after {fmt(NOW)}.
          </p>

          <button
            type="button"
            onClick={handleCheck}
            className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 active:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Check availability
          </button>
        </section>

        {/* Validation error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`flex items-start gap-3 rounded-2xl px-4 py-4 ring-1 ${
              result.status === 'available'
                ? 'bg-emerald-50 ring-emerald-200'
                : 'bg-rose-50 ring-rose-200'
            }`}
          >
            {result.status === 'available' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`text-base font-semibold ${
                  result.status === 'available' ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {result.status === 'available' ? 'Available' : 'Unavailable'}
              </p>
              {result.status === 'unavailable' && (
                <p className="text-sm text-rose-700 mt-0.5">{result.reason}</p>
              )}
              {result.status === 'available' && (
                <p className="text-sm text-emerald-700 mt-0.5">
                  {fmt(parseInt(start, 10))}–{fmt(parseInt(end, 10))} is free.
                </p>
              )}
            </div>
          </div>
        )}

        <footer className="mt-6 text-center text-xs text-slate-400">
          Demo data only. This tool does not make or change bookings.
        </footer>
      </div>
    </div>
  );
}
