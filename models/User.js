import mongoose from 'mongoose';
import { REGEX_NAME, REGEX_USERNAME, REGEX_EMAIL } from '../helpers/user';
import connectDb from '../utils/connectDb';

connectDb();

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (username) {
          var regex = REGEX_USERNAME;
          return !username || !username.trim().length || regex.test(username);
        },
        message:
          'Username must contain only letters (A-Z, a-z) and numbers (0-9).'
      },
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
      validate: {
        validator: function (name) {
          var regex = REGEX_NAME;

          const formattedName = name.replace(/\s/g, '');

          return !name || !name.trim().length || regex.test(formattedName);
        },
        message: 'Firstname must contain only Vietnamese letters and spaces.'
      },
      trim: true
    },
    lastname: {
      type: String,
      required: true,
      validate: {
        validator: function (name) {
          var regex = REGEX_NAME;

          const formattedName = name.replace(/\s/g, '');

          return !name || !name.trim().length || regex.test(formattedName);
        },
        message: 'Lastname must contain only Vietnamese letters and spaces.'
      },
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
      validate: {
        validator: function (email) {
          var regex = REGEX_EMAIL;
          return !email || !email.trim().length || regex.test(email);
        },
        message: 'Email format is not valid.'
      },
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

export default mongoose.models.User || mongoose.model('User', UserSchema);
