'use client';

import Image from 'next/image';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { giveawayAtom } from '@/app/state';

import { Winner, Countdown, ParticipantsStats, ParticipantDialog, Footer } from './components';

import { ClientOnly } from '@/app/components';

import { request } from '@/app/utils';

export function Giveaway({ data }) {
  useHydrateAtoms([[giveawayAtom, data]]);

  const [giveaway, setGiveaway] = useAtom(giveawayAtom);

  useEffect(() => {
    setGiveaway(data);
  }, [data]);

  const isActive = giveaway.status === 'in progress';

  // TODO: implement a retry mechanism when winner is not defined
  async function checkWinner() {
    if (!isActive) return;

    const resp = await request.get(`/api/giveaways/${giveaway._id}/winner`);
    if (resp.status !== 200) {
      setGiveaway(g => ({ ...g, status: 'completed' }));
      return;
    }

    const winner = { ...resp.data, isNew: true };
    setGiveaway(g => ({ ...g, status: 'completed', winner }));
  }

  // TODO: update participantsCount from api
  function updateParticipantsCount(val) {
    setGiveaway(g => ({ ...g, participantsCount: g.participantsCount + val }));
  }

  return (
    <>
      <div className="overflow-hidden relative text-center bg-white rounded w-3/4 shadow-md text-slate-500 shadow-slate-200">
        <ParticipantsStats participantsCount={giveaway.participantsCount} />

        <figure className="flex justify-center p-6 pb-0">
          <Image src="/placeholder.png" width={96} height={96} priority={true} quality={100} alt="giveaway product" />
        </figure>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-medium text-slate-700">{giveaway.title}</h3>
          <p className="px-4">{giveaway.description}</p>
        </div>

        <div className="text-center p-6">
          <Countdown onConclude={checkWinner} targetDate={giveaway.dueDate} />

          <ClientOnly>
            {isActive && (
              <ParticipantDialog
                giveawayId={giveaway._id}
                status={giveaway.status}
                updateParticipantsCount={updateParticipantsCount}
              />
            )}
          </ClientOnly>

          {giveaway.winner && <Winner giveawayId={giveaway._id} winner={giveaway.winner} />}
        </div>
      </div>

      <Footer />
    </>
  );
}
