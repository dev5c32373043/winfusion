import db, { Participant } from '@/app/db';

import { isEmpty } from '@/app/utils';

class ParticipantService {
  async findAll(giveawayId: string): Promise<Participant[]> {
    return db.Participant.find({ giveawayId }).lean();
  }

  async create({ giveawayId, name, email, extraInfo = null }): Promise<Participant> {
    const giveaway = await db.Giveaway.findOne({ _id: giveawayId }).select('status').lean();
    if (!giveaway) {
      throw new Error('Giveaway not found!', { cause: 'not-found' });
    }

    if (giveaway.status !== 'in progress') {
      throw new Error('Giveaway is not in progress!', { cause: 'bad-request' });
    }

    const participant = await db.Participant.findOne({ giveawayId, email }).select('_id').lean();
    if (participant) {
      throw new Error('Participant already exists!', { cause: 'bad-request' });
    }

    const data = { giveawayId, name, email };

    if (!isEmpty(extraInfo)) {
      data.extraInfo = extraInfo;
    }

    return db.Participant.create(data);
  }

  async deleteOne(giveawayId: string, _id: string): Promise<void> {
    await db.Participant.deleteOne({ _id, giveawayId });
  }
}

const participantService = new ParticipantService();

export default participantService;
