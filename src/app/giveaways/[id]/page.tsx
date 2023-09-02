import { notFound } from 'next/navigation';

import { Giveaway } from './giveaway';

import { request } from '@/app/utils';

export async function generateStaticParams() {
  const resp = await request.get('/api/giveaways/public');

  return resp.data.map(giveaway => ({
    id: giveaway._id,
  }));
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const giveaway = await getGiveaway(params.id);

  return {
    title: giveaway.title,
    description: giveaway.description,
  };
}

async function getGiveaway(id: string) {
  const resp = await request.get(`/api/giveaways/${id}`);
  if (resp.status === 404) return null;
  if (resp.status !== 200) {
    throw new Error('Something went wrong');
  }

  return resp.data;
}

export default async function GiveawayPage({ params }: { params: { id: string } }) {
  const giveaway = await getGiveaway(params.id);
  if (giveaway === null) return notFound();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Giveaway data={giveaway} />
    </main>
  );
}
