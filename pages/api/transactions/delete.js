import * as TransactionRepository from '../../../repository/transaction';
import * as UserRepository from '../../../repository/user';

export default async function (req, res) {
  try {
    const transaction = await TransactionRepository.findById(req.query.id);

    const responseData = await TransactionRepository.deleteOne(req.query.id);

    await UserRepository.updateBalance(
      req.query.userId,
      0 - parseFloat(transaction.amount.toString())
    );

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
