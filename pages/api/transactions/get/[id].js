import * as utilHelper from '../../../../helpers/util';
import * as TransactionRepository from '../../../../repository/transaction';

export default async function (req, res) {
  try {
    const { id: transactionId } = req.query;

    let responseData = await TransactionRepository.findById(transactionId);

    const userId = await utilHelper.getUserIdFromRequest(req);
  
    if (responseData.user_id != userId) {
      res.json({
        statusCode: 401,
        error: 'You are not authorized to view this transaction'
      });
    }

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
