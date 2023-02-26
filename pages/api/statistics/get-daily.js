import * as RecordRepository from '../../../repository/record';

export default async function (req, res) {
  try {
    const responseData = await RecordRepository.findByUserId(req.query.userId);

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
