'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { giveawaysAtom } from '@/app/state';

import { ListItem } from './list-item';
import { EmptyState } from '../empty-state';

export interface ListProps {
  data: any;
}

export function GiveawayList({ data }: ListProps) {
  useHydrateAtoms([[giveawaysAtom, data]]);
  const giveaways = useAtomValue(giveawaysAtom);

  if (!giveaways.length) return <EmptyState />;

  return (
    <div className="flex flex-wrap justify-center gap-4 my-8">
      {giveaways.map(item => (
        <ListItem key={item._id} item={item} />
      ))}
    </div>
  );
}
