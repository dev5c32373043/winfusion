'use client';

import Confetti from 'react-confetti';
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useSetAtom } from 'jotai';

import { giveawayAtom } from '@/app/state';

export function Winner({ giveawayId, winner }) {
  const setGiveaway = useSetAtom(giveawayAtom);

  const [confettiConf, setConfettiConf] = useState(null);

  useEffect(() => {
    if (!winner?.isNew) return;

    const joinedUserId = JSON.parse(localStorage.getItem(`joined-${giveawayId}`));
    if (joinedUserId !== winner._id) return;

    setConfettiConf({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setGiveaway(giveaway => ({ ...giveaway, winner: { ...giveaway.winner, isNew: false } }));

    setTimeout(() => {
      setConfettiConf({ recycle: false }); // turning off confetti
    }, 15000);
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="bg-white rounded  text-slate-500 p-8 animate-jump-in animate-duration-2000">
      <span className="text-2xl">
        Winner: {winner.name}{' '}
        <span role="img" aria-label="congrats!">
          🎉
        </span>
      </span>

      {confettiConf &&
        createPortal(
          <Confetti width={confettiConf.width} height={confettiConf.height} recycle={confettiConf.recycle} />,
          document.body,
        )}
    </div>
  );
}
