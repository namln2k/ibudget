import * as Category from '../../../models/Category';
import { ObjectId } from 'mongodb';

export default async function (req, res) {
  try {
    req.body.user_id = new ObjectId(req.body.userId);
    delete req.body.userId;

    await Category.createNew(req.body);

    res.json({ statusCode: 200 });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
