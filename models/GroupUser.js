import mongoose from 'mongoose';
import connectDb from '../utils/connectDb';
import User from './User';
import Group from './Group';

connectDb();

const Schema = mongoose.Schema;

const GroupUserSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    group: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Group'
    },
    amount_paid: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    amount_to_pay: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    /**
     * 1 - Holder verified
     * 2 - Participant verified
     * 3 - Both verified
     */
    verified: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'group_user'
  }
);

export default mongoose.models.GroupUser ||
  mongoose.model('GroupUser', GroupUserSchema);
