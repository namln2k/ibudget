import * as UserRepository from '../../../repository/user';

export default async function (req, res) {
  try {
    const result = await UserRepository.updateUserInfo(req.body._id, req.body);

    res.json({ statusCode: 200, data: result });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
