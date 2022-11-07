import clientPromise from '../lib/mongodb';

export default async function db() {
  const client = await clientPromise;
  const db = client.db('iBudget');

  return db;
}
