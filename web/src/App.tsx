import { useMemo, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { checkRoom, fmt, validateInput, type Result } from './availability';
import { filterRooms } from './filters';
import { NOW, ROOMS, type Equipment } from './rooms';
import RoomFilters from './components/RoomFilters';
import RoomList from './components/RoomList';
import AvailabilityForm from './components/AvailabilityForm';
import ResultCard from './components/ResultCard';

type Checked = { roomId: string; result: Result; start: number; end: number } | null;

export default function App() {
  const [attendees, setAttendees] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [checked, setChecked] = useState<Checked>(null);
  const [error, setError] = useState<string | null>(null);

  const attendeesValid = attendees.trim() === '' || /^\d+$/.test(attendees.trim());
  const attendeesNum = /^\d+$/.test(attendees.trim()) ? parseInt(attendees, 10) : 0;

  const filtered = useMemo(
    () => filterRooms(ROOMS, { attendees: attendeesNum, equipment }),
    [attendeesNum, equipment],
  );
  const selectedRoom = filtered.find((r) => r.id === selectedId) ?? null;
  const shownResult = checked && selectedRoom && checked.roomId === selectedRoom.id ? checked : null;

  // Single place that clears the previous result (F5).
  function reset() {
    setChecked(null);
    setError(null);
  }

  function changeAttendees(value: string) { setAttendees(value); reset(); }
  function toggleEquipment(item: Equipment) {
    setEquipment((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
    reset();
  }
  function selectRoom(id: string) { setSelectedId(id); reset(); }
  function changeStart(value: string) { setStart(value); reset(); }
  function changeEnd(value: string) { setEnd(value); reset(); }

  function handleCheck() {
    if (!selectedRoom) return;
    const vErr = validateInput(start, end);
    if (vErr) {
      setError(vErr);
      setChecked(null);
      return;
    }
    setError(null);
    const s = parseInt(start, 10);
    const e = parseInt(end, 10);
    setChecked({ roomId: selectedRoom.id, result: checkRoom(selectedRoom, s, e, NOW), start: s, end: e });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg">
        <header className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20 mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Smart Campus Room Availability</h1>
          <p className="text-sm text-slate-500 mt-1">
            Checking only — no bookings are created or modified. Current time: {fmt(NOW)}
          </p>
        </header>

        <RoomFilters
          attendees={attendees}
          attendeesValid={attendeesValid}
          equipment={equipment}
          onAttendeesChange={changeAttendees}
          onToggleEquipment={toggleEquipment}
        />
        <RoomList rooms={filtered} selectedId={selectedRoom?.id ?? null} onSelect={selectRoom} />

        {selectedRoom ? (
          <AvailabilityForm
            room={selectedRoom}
            start={start}
            end={end}
            onStartChange={changeStart}
            onEndChange={changeEnd}
            onCheck={handleCheck}
          />
        ) : (
          filtered.length > 0 && (
            <p className="text-sm text-slate-500 text-center mb-4">Select a room above to check its availability.</p>
          )
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}

        {shownResult && selectedRoom && (
          <ResultCard
            result={shownResult.result}
            roomName={selectedRoom.name}
            start={shownResult.start}
            end={shownResult.end}
          />
        )}

        <footer className="mt-6 text-center text-xs text-slate-400">
          Demo data only. This tool does not make or change bookings.
        </footer>
      </div>
    </div>
  );
}