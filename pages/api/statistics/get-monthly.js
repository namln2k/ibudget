import * as utilHelper from '../../../helpers/util';
import * as RecordRepository from '../../../repository/record';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    const responseData = await RecordRepository.findByUserId(userId, 3);

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
