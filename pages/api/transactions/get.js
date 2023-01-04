import * as Transaction from '../../../models/Transaction';

export default async function (req, res) {
  try {
    let responseData;

    if (req.query.id) {
      responseData = await Transaction.getOneById(req.query.id);
    } else {
      responseData = await Transaction.getAllByUserId(req.query.userId);
    }

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
