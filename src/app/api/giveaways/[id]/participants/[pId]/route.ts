import { NextResponse } from 'next/server';

import * as Sentry from '@sentry/nextjs';

import ParticipantService from '../services/participant.service';
import { isMongoId, to } from '@/app/utils';

export async function DELETE(req: NextRequest, ctx: { params }) {
  const giveawayId = ctx.params.id;

  if (!isMongoId(giveawayId)) {
    return NextResponse.json({ message: 'Invalid giveaway id' }, { status: 400 });
  }

  const _id = ctx.params.pId;

  if (!isMongoId(_id)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const [removeErr] = await to(ParticipantService.deleteOne(giveawayId, _id));
  if (removeErr) {
    Sentry.captureException(removeErr);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
