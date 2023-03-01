import mongoose from 'mongoose';
import connectDb from '../utils/connectDb';
import User from './User';

connectDb();

const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    holder: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    due_date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
