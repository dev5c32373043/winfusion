import { NextResponse } from 'next/server';

import * as Sentry from '@sentry/nextjs';

import GiveawayService from '../services/giveaway.service';
import { to } from '@/app/utils';

export const GET = async () => {
  const [err, giveaways] = await to(GiveawayService.find());
  if (err) {
    Sentry.captureException(err);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(giveaways);
};
