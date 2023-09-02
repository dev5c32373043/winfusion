import * as Sentry from '@sentry/nextjs';

import GiveawayService from '../../giveaways/services/giveaway.service';
import WinnerDeterminationService from '../../giveaways/services/winner-determination.service';

import { to } from '@/app/utils';

// Ideally we should use delayed job for each individual giveaway.
export async function GET() {
  const giveaways = await GiveawayService.findAll({ status: 'in progress' });

  for (const giveaway of giveaways) {
    const [err] = await to(WinnerDeterminationService.checkWinner(giveaway._id));
    if (err) {
      Sentry.captureException(err);
    }
  }

  return NextResponse.json({ ok: true });
}
