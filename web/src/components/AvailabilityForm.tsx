import { fmt } from '../availability';
import { NOW, type Room } from '../rooms';

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function TimeField({ id, label, value, placeholder, onChange }: TimeFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-600 mb-1.5">
        {label} <span className="text-slate-400">(min)</span>
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      />
    </div>
  );
}

interface Props {
  room: Room;
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onCheck: () => void;
}

export default function AvailabilityForm({ room, start, end, onStartChange, onEndChange, onCheck }: Props) {
  const bookings = [...room.bookings].sort((a, b) => a[0] - b[0]);
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-4">
      <h2 className="text-sm font-semibold mb-3">3. Check {room.name}</h2>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Existing bookings</p>
      {bookings.length === 0 ? (
        <p className="text-sm text-slate-400 mb-4">None for the rest of the day.</p>
      ) : (
        <ul className="space-y-1.5 mb-4">
          {bookings.map(([bs, be], i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="font-medium">{fmt(bs)} – {fmt(be)}</span>
              <span className="text-slate-400">({be - bs} min)</span>
            </li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-2 gap-3">
        <TimeField id="start" label="Start" value={start} placeholder="e.g. 660" onChange={onStartChange} />
        <TimeField id="end" label="End" value={end} placeholder="e.g. 720" onChange={onEndChange} />
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Whole minutes after midnight. 0–1440. Max 120 min. Start must be after {fmt(NOW)}.
      </p>
      <button
        type="button"
        onClick={onCheck}
        className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      >
        Check availability
      </button>
    </section>
  );
}