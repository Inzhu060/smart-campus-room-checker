import { CheckCircle2, XCircle } from 'lucide-react';
import { fmt, type Result } from '../availability';

interface Props {
  result: Result;
  roomName: string;
  start: number;
  end: number;
}

export default function ResultCard({ result, roomName, start, end }: Props) {
  const ok = result.status === 'available';
  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-2xl px-4 py-4 ring-1 ${
        ok ? 'bg-emerald-50 ring-emerald-200' : 'bg-rose-50 ring-rose-200'
      }`}
    >
      {ok ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <p className={`text-base font-semibold ${ok ? 'text-emerald-800' : 'text-rose-800'}`}>
          {ok ? 'Available' : 'Unavailable'}
        </p>
        {result.status === 'unavailable' ? (
          <p className="text-sm text-rose-700 mt-0.5">{result.reason}</p>
        ) : (
          <p className="text-sm text-emerald-700 mt-0.5">
            {roomName}: {fmt(start)}–{fmt(end)} is free.
          </p>
        )}
      </div>
    </div>
  );
}