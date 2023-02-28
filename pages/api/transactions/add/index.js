import mongoose from 'mongoose';
import * as utilHelper from '../../../../helpers/util';
import * as TransactionRepository from '../../../../repository/transaction';
import * as UserRepository from '../../../../repository/user';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);
    req.body.user_id = mongoose.Types.ObjectId(userId);

    await TransactionRepository.create(req.body);

    await UserRepository.updateBalance(userId, req.body.amount);

    res.json({ statusCode: 200 });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
