import db from '@/app/db';

import { request } from '@/app/utils';
// TODO: resend email in case of failure
export default async function notifyWinner(giveaway): Promise<void> {
  const { winner, title } = giveaway;

  const payload = {
    from: {
      email: 'info@winfusion.com',
    },
    personalizations: [
      {
        to: [{ email: winner.email }],
        dynamic_template_data: { winnerName: winner.name, giveawayTitle: title },
      },
    ],
    template_id: process.env.SENDGRID_WINNER_TEMPLATE_ID,
  };

  await request.post('https://api.sendgrid.com/v3/mail/send', payload, {
    headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
  });
}
