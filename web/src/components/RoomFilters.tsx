import { ALL_EQUIPMENT, type Equipment } from '../rooms';

interface Props {
  attendees: string;
  attendeesValid: boolean;
  equipment: Equipment[];
  onAttendeesChange: (value: string) => void;
  onToggleEquipment: (item: Equipment) => void;
}

export default function RoomFilters({
  attendees, attendeesValid, equipment, onAttendeesChange, onToggleEquipment,
}: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-4">
      <h2 className="text-sm font-semibold mb-3">1. Find rooms</h2>
      <label htmlFor="attendees" className="block text-xs font-medium text-slate-600 mb-1.5">
        Attendees
      </label>
      <input
        id="attendees"
        inputMode="numeric"
        value={attendees}
        onChange={(e) => onAttendeesChange(e.target.value)}
        placeholder="e.g. 10"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      />
      {!attendeesValid && (
        <p className="text-xs text-amber-700 mt-1">Attendees must be a whole number; showing all rooms.</p>
      )}
      <p className="text-xs font-medium text-slate-600 mt-4 mb-1.5">Required equipment (all selected)</p>
      <div className="flex flex-wrap gap-2">
        {ALL_EQUIPMENT.map((item) => (
          <label
            key={item}
            className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-300 px-3 py-1.5 text-sm cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={equipment.includes(item)}
              onChange={() => onToggleEquipment(item)}
            />
            {item}
          </label>
        ))}
      </div>
    </section>
  );
}