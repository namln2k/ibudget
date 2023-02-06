import mongoose from 'mongoose';
import * as RecordRepository from '../../../repository/record';

export default async function (req, res) {
  try {
    req.body.user_id = mongoose.Types.ObjectId(req.body.user_id);
    if (req.body.category_id)
      req.body.category_id = mongoose.Types.ObjectId(req.body.category_id);

    const addedRecord = await RecordRepository.create(req.body);

    res.json({ statusCode: 200, data: addedRecord });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
