import * as TransactionRepository from '../../../repository/transaction';

export default async function (req, res) {
  try {
    if (req.query.id) {
      let responseData = await TransactionRepository.findById(req.query.id);

      res.json({ statusCode: 200, data: responseData });
    } else {
      let responseData = await TransactionRepository.findByUserId(
        req.query.userId
      );

      responseData.forEach((element, index) => {
        element.id = index + 1;
      });

      res.json({ statusCode: 200, data: responseData });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
