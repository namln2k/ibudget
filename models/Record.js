import mongoose from 'mongoose';
import connectDb from '../utils/connectDb';
import Category from './Category';

connectDb();

const Schema = mongoose.Schema;

const RecordSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    /**
     * 1 - Daily
     * 2 - Monthly
     * 3 - Yearly
     */
    time_type: {
      type: Number,
      required: true
    },
    /**
     * 1 - Income
     * 2 - Expense
     * 3 - User balance
     */
    spending_type: {
      type: Number,
      required: true
    },
    /**
     * 1 - Total of transactions that does not belong to any category
     * 2 - Total of transactions by category id
     * 3 - Total of all transactions
     */
    category_type: {
      type: Number,
      required: false
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Category'
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.models.Record ||
  mongoose.model('Record', RecordSchema);
