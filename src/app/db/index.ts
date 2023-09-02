import setupDB from './setup';

import { GiveawayModel, ParticipantModel } from './models';

class DBProxy {
  private connection;
  private models = {
    Giveaway: GiveawayModel,
    Participant: ParticipantModel,
  };

  constructor() {
    this.connection = setupDB();

    for (const [modelName, model] of Object.entries(this.models)) {
      this[modelName] = model;
    }
  }
}

const db = new DBProxy();

export default db;
