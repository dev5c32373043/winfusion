import crypto from 'crypto';

import db from '@/app/db';

import notifyWinner from './notify-winner.service';

import * as Sentry from '@sentry/nextjs';

export interface GiveawayWinner {
  _id: string;
  name: string;
  email: string;
  extraInfo?: string;
}

export type DeterminedWinner = { winner: GiveawayWinner; participantsCount: number };

class WinnerDeterminationService {
  async determineWinner(giveawayId: string): Promise<DeterminedWinner | null> {
    const participantsCount = await db.Participant.countDocuments({ giveawayId });
    if (participantsCount === 0) return null;

    // Create a typed array to store the random index
    const randomIndexArray = new Uint32Array(1);

    // Fill the array with cryptographically secure random values
    crypto.getRandomValues(randomIndexArray);

    // Get the random index within the range of the participants count
    const randomIndex = randomIndexArray[0] % participantsCount;

    // Retrieve the randomly chosen winner from the db
    const [winner] = await db.Participant.find({ giveawayId })
      .limit(1)
      .skip(randomIndex)
      .select('name email extraInfo')
      .lean();

    return { winner, participantsCount };
  }

  async closeGiveaway(_id: string): Promise<GiveawayWinner | null> {
    const result = await this.determineWinner(_id);

    const query = { _id, status: 'in progress' };
    const $set = { status: 'completed' };

    if (result !== null) {
      Object.assign($set, result);
    }

    const updatedRecord = await db.Giveaway.findOneAndUpdate(query, { $set }, { new: true }).lean();
    if (!updatedRecord) {
      throw new Error('Giveaway not found', { cause: 'not-found' });
    }
    // no winner === no participants
    if (result === null) return null;

    notifyWinner(updatedRecord).catch(Sentry.captureException);

    // Removing all participants
    db.Participant.deleteMany({ giveawayId: _id }).catch(Sentry.captureException);

    return updatedRecord.winner;
  }

  async checkWinner(giveawayId: string): Promise<GiveawayWinner | null> {
    const giveaway = await db.Giveaway.findOne({ _id: giveawayId, status: ['in progress', 'completed'] }).lean();
    if (!giveaway) return null;
    if (giveaway.status === 'completed') return giveaway.winner;

    const shouldBeClosed = Date.now() >= giveaway.dueDate.getTime();
    if (!shouldBeClosed) return null;
    // Ideally we shouldn't call this method from here.
    return this.closeGiveaway(giveaway._id);
  }
}

const winnerDeterminationService = new WinnerDeterminationService();

export default winnerDeterminationService;
