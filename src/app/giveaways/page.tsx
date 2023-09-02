import { cookies } from 'next/headers';

import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import { Header, GiveawayList } from './components';
import { request } from '@/app/utils';

export default withPageAuthRequired(async function Giveaways() {
  const authCookie = cookies().get('appSession')?.value;
  const resp = await request.get('/api/giveaways', {
    headers: { cookie: `appSession=${authCookie}` },
  });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <GiveawayList data={resp.data} />
    </main>
  );
});
