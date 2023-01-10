import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

const connectMongo = () => {
  mongoose.set('strictQuery', false);

  if (!mongoose.connection.readyState) {
    mongoose.connect(uri, () => {
      console.log('MongoDb successfully connected!');
    });
  }
};

export default connectMongo;
