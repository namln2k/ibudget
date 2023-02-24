import mongoose from 'mongoose';
import connectDb from '../utils/connectDb';

connectDb();

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    firstname: {
      type: String,
      required: true,
      trim: true
    },
    lastname: {
      type: String,
      required: true,
      trim: true
    },
    balance: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: false,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ],
      lowercase: true
    },
    phone_number: {
      type: String,
      required: false,
      trim: true,
      match: [/\d+/g, 'Please fill a valid phone number']
    },
    quote: {
      type: String,
      required: false,
      trim: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

UserSchema.path('email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email.text);
}, 'Please enter a valid email!');

export default mongoose.models.User || mongoose.model('User', UserSchema);
