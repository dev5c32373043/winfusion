import { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { alertAtom } from '../state';

export function AlertContainer() {
  const [{ message, duration }, setAlertState] = useAtom(alertAtom);

  useEffect(() => {
    if (!message) return;

    const timeoutId = setTimeout(() => {
      setAlertState({ duration: 5000 });
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [message, duration]);

  if (!message) return null;

  return (
    <div className="alert alert-error absolute top-24 end-10 z-50 w-auto text-slate-100 animate-jump-in animate-once animate-ease-in-out">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export function useAlert() {
  const setAlertState = useSetAtom(alertAtom);
  return (message: string, duration: number = 5000) => setAlertState({ message, duration });
}
