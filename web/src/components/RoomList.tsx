import { Lock, Unlock, Users, SearchX } from 'lucide-react';
import type { Room } from '../rooms';

interface Props {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function RoomList({ rooms, selectedId, onSelect }: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-4">
      <h2 className="text-sm font-semibold mb-3">
        2. Choose a room <span className="text-slate-400 font-normal">({rooms.length} found)</span>
      </h2>
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center text-center py-6 text-slate-500" role="status">
          <SearchX className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium">No rooms match your requirements.</p>
          <p className="text-xs mt-1">Try fewer attendees or remove some equipment.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id}>
              <button
                type="button"
                aria-pressed={selectedId === room.id}
                onClick={() => onSelect(room.id)}
                className={`w-full text-left rounded-xl px-4 py-3 ring-1 transition-colors ${
                  selectedId === room.id ? 'ring-2 ring-sky-500 bg-sky-50' : 'ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{room.name}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      room.blocked
                        ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                        : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    }`}
                  >
                    {room.blocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {room.blocked ? 'Blocked' : 'Open'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Capacity {room.capacity} · {room.equipment.join(', ')}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}