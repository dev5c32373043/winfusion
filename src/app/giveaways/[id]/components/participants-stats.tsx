import { shortNumber } from '@/app/utils';

export interface ParticipantsStatsProps {
  participantsCount: number;
  size?: string;
}

export function ParticipantsStats({ participantsCount, size }: ParticipantsStatsProps) {
  if (size === 'small') {
    return (
      <div className="badge bg-white text-primary select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-4 h-4 stroke-current"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>

        <span className="pl-1">{shortNumber(participantsCount)}</span>
      </div>
    );
  }

  return (
    <div className="stats absolute right-0">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div className="stat-title">Participants</div>
        <div className="stat-value text-primary">{shortNumber(participantsCount)}</div>
      </div>
    </div>
  );
}
