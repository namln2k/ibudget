import * as utilHelper from '../../../../helpers/util';
import * as TransactionRepository from '../../../../repository/transaction';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    const responseData = await TransactionRepository.findByUserId(userId);

    responseData.forEach((element, index) => {
      element.id = index + 1;
    });

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
