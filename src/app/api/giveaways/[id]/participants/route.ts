import { type NextRequest, NextResponse } from 'next/server';

import * as Sentry from '@sentry/nextjs';

import ParticipantService from './services/participant.service';
import { isMongoId, to, pick } from '@/app/utils';

export async function POST(req: NextRequest, ctx: { params }) {
  const giveawayId = ctx.params.id;

  if (!isMongoId(giveawayId)) {
    return NextResponse.json({ message: 'Invalid giveaway id' }, { status: 400 });
  }

  const body = await req.json();
  const payload = pick(body, ['name', 'email', 'extraInfo']);
  const [createErr, participant] = await to(ParticipantService.create({ giveawayId, ...payload }));
  if (createErr) {
    if (createErr.cause === 'not-found') {
      return NextResponse.json({ message: 'Giveaway not found' }, { status: 404 });
    }

    if (createErr.cause === 'bad-request') {
      return NextResponse.json({ message: createErr.message }, { status: 400 });
    }

    Sentry.captureException(createErr);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(participant);
}
