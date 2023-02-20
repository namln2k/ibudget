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
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    monthly_target: {
      type: mongoose.Types.Decimal128,
      required: false
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
