import mongoose from 'mongoose';
import connectDb from '../utils/connectDb';

connectDb();

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    holder_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    user_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    /**
     * Money split rules:
     * 1. Split evenly among participants
     * 2. Each participant has a specific amount that needs to be paid
     */
    split_rule: {
      type: Number,
      required: true
    },
    total: {
      type: mongoose.Types.Decimal128
    },
    /**
     * Event status:
     * 1. Ongoing
     * 2. Finished on time
     * 3. Due date passed but not fully paid
     */
    status: {
      type: Number
    },
    due_date: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.models.Category ||
  mongoose.model('Category', CategorySchema);
