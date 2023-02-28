import * as utilHelper from '../../../../helpers/util';
import * as TransactionRepository from '../../../../repository/transaction';
import * as UserRepository from '../../../../repository/user';

export default async function (req, res) {
  try {
    const { id: transactionId } = req.query;

    const transaction = await TransactionRepository.findById(transactionId);

    if (!transaction) {
      res.json({ statusCode: 400, error: 'Transaction no longer exists!' });
    }

    const userId = await utilHelper.getUserIdFromRequest(req);

    if (transaction.user_id != userId) {
      res.json({
        statusCode: 401,
        error: 'You are not allowed to edit this transaction!'
      });
    }

    const deletedCount = await TransactionRepository.deleteOne(transactionId);

    if (deletedCount) {
      await UserRepository.updateBalance(
        userId,
        0 - parseFloat(transaction.amount.toString())
      );

      res.json({ statusCode: 200, data: deletedCount });
    } else {
      res.json({
        statusCode: 400,
        error:
          'Unspecified errors happened! Some transactions might not have been deleted!'
      });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
