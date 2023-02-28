import * as utilHelper from '../../../../helpers/util';
import * as TransactionRepository from '../../../../repository/transaction';
import * as UserRepository from '../../../../repository/user';

export default async function (req, res) {
  try {
    const { id: transactionId } = req.query;

    const existedTransaction = await TransactionRepository.findById(
      transactionId
    );

    if (!existedTransaction) {
      res.json({ statusCode: 400, error: 'Transaction no longer exists!' });
    }

    const userId = await utilHelper.getUserIdFromRequest(req);

    if (existedTransaction.user_id != userId) {
      res.json({
        statusCode: 401,
        error: 'You are not allowed to edit this transaction!'
      });
    }

    const updatedTransaction = await TransactionRepository.updateOne(
      { _id: transactionId },
      req.body
    );

    await UserRepository.updateBalance(
      updatedTransaction.user_id,
      req.body.amount.$numberDecimal -
        parseFloat(updatedTransaction.amount.toString())
    );

    res.json({ statusCode: 200, data: updatedTransaction });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
