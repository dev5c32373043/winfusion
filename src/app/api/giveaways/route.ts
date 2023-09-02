import { type NextRequest, NextResponse } from 'next/server';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import * as Sentry from '@sentry/nextjs';

import GiveawayService from './services/giveaway.service';
import { pick, to } from '@/app/utils';

export const GET = withApiAuthRequired(async () => {
  const { user } = await getSession();

  const [err, giveaways] = await to(GiveawayService.find({ userId: user.sub }));
  if (err) {
    Sentry.captureException(err);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(giveaways);
});

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  const { user } = await getSession();

  const body = await req.json();
  const payload = pick(body, ['title', 'description', 'dueDate', 'status']);
  const [err, giveaway] = await to(GiveawayService.create({ ...payload, userId: user.sub }));
  if (err) {
    Sentry.captureException(err);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(giveaway);
});
