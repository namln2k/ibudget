import * as CategoryRepository from '../../../repository/category';
import mongoose from 'mongoose';

export default async function (req, res) {
  try {
    req.body.user_id = mongoose.Types.ObjectId(req.body.userId);
    delete req.body.userId;

    const addedCategory = await CategoryRepository.create(req.body);

    res.json({ statusCode: 200, data: addedCategory });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
