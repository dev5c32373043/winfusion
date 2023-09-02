import mongoose, { Schema } from 'mongoose';

export interface Participant {
  name: string;
  email: string;
  extraInfo?: string;
  createdAt: Date;
  giveawayId: string;
}

const ParticipantSchema = new Schema<Participant>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator(val) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
  extraInfo: String,
  giveawayId: { type: Schema.Types.ObjectId, ref: 'Giveaway' },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const ParticipantModel =
  mongoose.models.Participant || mongoose.model<Participant>('Participant', ParticipantSchema);
