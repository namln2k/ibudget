import connectMongo from '../lib/mongodb';

const connectDb = () => {
  connectMongo();
};

export default connectDb;
