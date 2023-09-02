import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import * as Sentry from '@sentry/nextjs';

import GiveawayService from '../services/giveaway.service';
import { isMongoId, pick, to } from '@/app/utils';

export async function GET(request: NextRequest, ctx: { params }) {
  const _id = ctx.params.id;

  if (!isMongoId(_id)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const [err, giveaway] = await to(
    GiveawayService.findOneWithRel(
      { _id, status: { $in: ['in progress', 'completed'] } },
      '-userId -createdAt -__v -winner.email -winner.extraInfo',
    ),
  );

  if (err) {
    Sentry.captureException(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  if (!giveaway) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(giveaway);
}

export const PUT = withApiAuthRequired(async (req: NextRequest, ctx: { params }) => {
  const _id = ctx.params.id;

  if (!isMongoId(_id)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const { user } = await getSession();

  const body = await req.json();
  const payload = pick(body, ['title', 'description', 'dueDate', 'status']);
  const [err, giveaway] = await to(GiveawayService.updateOne({ _id, userId: user.sub }, payload));
  if (err) {
    Sentry.captureException(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  if (!giveaway) {
    return NextResponse.json({ message: 'Giveaway not found' }, { status: 404 });
  }

  const path = req.nextUrl.searchParams.get('path');
  revalidatePath(path);

  return NextResponse.json(giveaway);
});

export const DELETE = withApiAuthRequired(async (req: NextRequest, ctx: { params }) => {
  const _id = ctx.params.id;

  if (!isMongoId(_id)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const { user } = await getSession();

  const [fetchErr, giveaway] = await to(GiveawayService.findOne({ _id, userId: user.sub }));
  if (fetchErr) {
    Sentry.captureException(fetchErr);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  if (!giveaway) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const [removeErr] = await to(GiveawayService.deleteOne(user.sub, _id));
  if (removeErr) {
    Sentry.captureException(removeErr);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  const path = req.nextUrl.searchParams.get('path');
  revalidatePath(path);

  return NextResponse.json({ ok: true });
});
