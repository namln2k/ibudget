import * as TransactionRepository from '../../../repository/transaction';
import * as UserRepository from '../../../repository/user';
import mongoose from 'mongoose';

export default async function (req, res) {
  try {
    const userId = mongoose.Types.ObjectId(req.body.userId);
    delete req.body.userId;

    req.body.user_id = userId;

    await TransactionRepository.create(req.body);

    await UserRepository.updateBalance(userId, req.body.amount);

    res.json({ statusCode: 200 });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
