import { MongoServerError } from 'mongodb';
import dbConnection from '../helpers/db';

const COLLECTION = 'users';

export async function getAll() {
  try {
    const db = await dbConnection();

    const users = await db.collection(COLLECTION).find({}).toArray();

    return users;
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new Error(error.toString());
    }

    throw new Error('Something went wrong!');
  }
}

export async function getOneByUsername(username) {
  try {
    const db = await dbConnection();

    const users = await db
      .collection(COLLECTION)
      .find({ username: username })
      .toArray();

    if (users.length === 1) {
      return users[0];
    }
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new Error(error.toString());
    }

    throw new Error('Something went wrong!');
  }
}

export async function createNew(user) {
  try {
    const db = await dbConnection();

    await db.collection(COLLECTION).insertOne(user);
  } catch (error) {
    if (error instanceof MongoServerError) {
      throw new Error(error.toString());
    }

    throw new Error('Something went wrong!');
  }
}
