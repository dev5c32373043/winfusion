import Link from 'next/link';
import dayjs from 'dayjs';
import * as Sentry from '@sentry/nextjs';

import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { GiveawayStatus } from '../giveaway-status';
import { ParticipantsStats } from '../../[id]/components';
import { useAlert } from '@/app/components';

import { giveawaysAtom, giveawayFormDataAtom } from '@/app/state';
import { request, to } from '@/app/utils';

export interface ListItemProps {
  item: any;
}

export function ListItem({ item }: ListItemProps) {
  const [reqState, setReqState] = useState({ status: 'idle' });
  const [giveaways, setGiveaways] = useAtom(giveawaysAtom);
  const setFormDataValue = useSetAtom(giveawayFormDataAtom);

  const showAlert = useAlert();

  async function editItem(item) {
    const localDueDate = dayjs(item.dueDate).format('YYYY-MM-DDTHH:mm');
    setFormDataValue({ ...item, dueDate: localDueDate });
  }

  async function removeItem(id: string) {
    if (reqState.status !== 'idle') return;

    setReqState({ status: 'pending' });

    const [err, resp] = await to(request.delete(`/api/giveaways/${id}`));
    if (err || resp.status !== 200) {
      showAlert('Something is not right, please get in touch with the support');
      setReqState({ status: 'idle' });
      return;
    }

    setGiveaways(giveaways.filter(item => item._id !== id));
  }

  const isAccessable = ['in progress', 'completed'].includes(item.status);

  return (
    <div className="card w-96 bg-primary text-primary-content relative">
      <div className="card-body">
        <div className="flex absolute top-5 end-5 gap-2">
          <GiveawayStatus status={item.status} />
          <ParticipantsStats participantsCount={item.participantsCount} size={'small'} />
        </div>

        <h2 className="card-title text-white">{item.title}</h2>
        <p>{item.description}</p>

        {item.winner && (
          <>
            <div className="rounded text-white my-2">
              <span className="select-none">Winner:</span> {item.winner.name}
              <div className="divider my-1"></div>
              <span className="select-none">Email:</span> {item.winner.email}
              {item.winner.extraInfo && (
                <>
                  <div className="divider my-1"></div>
                  <span className="select-none">Extra Info:</span> {item.winner.extraInfo}
                </>
              )}
            </div>
          </>
        )}

        <div className="card-actions justify-between">
          <button className="btn btn-primary" onClick={() => removeItem(item._id)}>
            {reqState.status !== 'idle' && <span className="loading loading-spinner"></span>}
            Remove
          </button>
          <div className={`flex ${isAccessable ? 'justify-between' : 'justify-end'} w-2/4`}>
            <button className="btn btn-neutral" onClick={() => editItem(item)}>
              Edit
            </button>

            {isAccessable && (
              <Link className="btn btn-success" href={`/giveaways/${item._id}`}>
                Show
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
