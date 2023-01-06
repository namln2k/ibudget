import { MongoServerError, ObjectId } from 'mongodb';
import dbConnection from '../helpers/db';

const COLLECTION = 'categories';

export async function getAll() {
  try {
    const db = await dbConnection();

    const transactions = await db.collection(COLLECTION).find({}).toArray();

    return transactions;
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new Error(error.toString());
    }

    throw new Error('Something went wrong!');
  }
}

export async function getAllByUserId(userId) {
  try {
    const db = await dbConnection();

    const transactions = await db
      .collection(COLLECTION)
      .find({ user_id: new ObjectId(userId) })
      .toArray();

    return transactions;
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new Error(error.toString());
    }

    throw new Error('Something went wrong!');
  }
}

export async function getOneById(id) {
  try {
    const db = await dbConnection();

    const transactions = await db
      .collection(COLLECTION)
      .find({
        _id: new ObjectId(id)
      })
      .toArray();

    if (transactions.length === 1) {
      return transactions[0];
    }
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new Error(error.toString());
    }

    throw new Error('Something went wrong!');
  }
}
