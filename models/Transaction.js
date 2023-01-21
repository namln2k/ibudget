import mongoose from 'mongoose';
import connectDb from '../utils/connectDb';
import Category from './Category';

connectDb();

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    time: {
      type: Date,
      required: true,
      default: Date.now
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    detail: {
      type: String,
      required: false,
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Category'
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);
