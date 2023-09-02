import { type NextRequest, NextResponse } from 'next/server';

import * as Sentry from '@sentry/nextjs';

import WinnerDeterminationService from '../../services/winner-determination.service';
import { isMongoId, to } from '@/app/utils';

export async function GET(request: NextRequest, ctx: { params }) {
  const _id = ctx.params.id;

  if (!isMongoId(_id)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const [err, winner] = await to(WinnerDeterminationService.checkWinner(_id));
  if (err) {
    Sentry.captureException(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  if (!winner) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ _id: winner._id, name: winner.name });
}
