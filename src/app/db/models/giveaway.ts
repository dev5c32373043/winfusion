import mongoose from 'mongoose';

export enum GiveawayStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

export interface Giveaway {
  userId: string;
  title: string;
  description: string;
  status: GiveawayStatus;
  dueDate: Date;
  winner?: { _id: string; name: string; email: string; extraInfo?: string };
  createdAt: Date;
}

const GiveawaySchema = new mongoose.Schema<Giveaway>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'in progress',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  winner: {
    _id: String,
    name: String,
    email: String,
    extraInfo: String,
  },
  participantsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const GiveawayModel = mongoose.models.Giveaway || mongoose.model<Giveaway>('Giveaway', GiveawaySchema);
