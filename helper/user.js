import dbConnection from './db';

export async function getAll() {
  const db = await dbConnection();

  const users = await db.collection('users').find({}).toArray();

  return users;
}

export async function getOneByUsername(username) {
  const db = await dbConnection();

  const users = await db
    .collection('users')
    .find({ username: username })
    .toArray();

  if (users.length === 1) {
    return users[0];
  }
}
