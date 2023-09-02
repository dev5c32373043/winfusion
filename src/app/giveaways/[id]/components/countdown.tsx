'use client';

import { useEffect, useState } from 'react';

export interface CountdownProps {
  onConclude: () => void;
  targetDate: string;
}

export function Countdown({ onConclude, targetDate }: CountdownProps) {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = new Date(targetDate).getTime() - now;

      if (diff <= 0) {
        clearInterval(interval);
        onConclude();
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      setTotalSeconds(totalSecs);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(totalSeconds / 60 / 60 / 24);
  const hours = Math.floor(totalSeconds / 60 / 60) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  return (
    <div className="grid grid-flow-col gap-5 mb-5 place-content-center text-center auto-cols-max select-none">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': days }}></span>
        </span>
        days
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': hours }}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': minutes }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': seconds }}></span>
        </span>
        sec
      </div>
    </div>
  );
}
