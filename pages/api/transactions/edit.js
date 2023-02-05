import * as TransactionRepository from '../../../repository/transaction';
import * as UserRepository from '../../../repository/user';

export default async function (req, res) {
  try {
    const { _id, title, time, amount, category, detail } = req.body;

    const updatedTransaction = await TransactionRepository.updateOne(
      { _id: _id },
      { _id, title, time, amount, category, detail }
    );

    await UserRepository.updateBalance(
      updatedTransaction.user_id,
      parseFloat(updatedTransaction.amount.toString()) - amount.$numberDecimal
    );

    res.json({ statusCode: 200, data: updatedTransaction });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
