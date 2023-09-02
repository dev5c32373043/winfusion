import db, { Giveaway } from '@/app/db';
import WinnerDeterminationService from './winner-determination.service';

class GiveawayService {
  async find(q = {}): Promise<Giveaway[]> {
    const query = { ...q };

    if (!query.userId) {
      query.status = ['in progress', 'completed'];
    }

    return db.Giveaway.find(query).sort('-createdAt').lean();
  }

  async findOne(query = {}): Promise<Giveaway | null> {
    return db.Giveaway.findOne(query).lean();
  }

  async findOneWithRel(query = {}, select?: string | object): Promise<Giveaway | null> {
    const giveaway = await db.Giveaway.findOne(query).select(select).lean();
    if (!giveaway) return null;

    if (giveaway.status === 'in progress') {
      giveaway.participantsCount = await db.Participant.countDocuments({ giveawayId: giveaway._id });
    }

    return giveaway;
  }

  async updateOne(query, payload: Partial<Giveaway>): Promise<Giveaway | null> {
    if (!query.userId) {
      throw new Error('User id is required!');
    }

    const giveaway = await db.Giveaway.findOne(query).lean();
    if (!giveaway) return null;

    const $set = { ...payload };

    if (giveaway.status === 'completed' && $set.status) {
      delete $set.status;
    }

    const updatedRecord = await db.Giveaway.findOneAndUpdate(query, { $set }, { new: true }).lean();
    if (!updatedRecord) return null;

    if (updatedRecord.status === 'completed') {
      const winner = await WinnerDeterminationService.checkWinner(updatedRecord._id);
      if (winner !== null) {
        updatedRecord.winner = winner;
      }
    }

    return updatedRecord;
  }

  async create(data): Promise<Giveaway> {
    return db.Giveaway.create(data);
  }

  async deleteOne(userId: string, _id: string): Promise<null | void> {
    const giveaway = await db.Giveaway.exists({ _id, userId });
    if (!giveaway) return null;

    await db.Giveaway.deleteOne({ _id: giveaway._id });
    await db.Participant.deleteMany({ giveawayId: giveaway._id });
  }
}

const giveawayService = new GiveawayService();

export default giveawayService;
