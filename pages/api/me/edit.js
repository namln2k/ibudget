import * as utilHelper from '../../../helpers/util';
import * as UserRepository from '../../../repository/user';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    if (req.body._id != userId) {
      res.json({
        statusCode: 401,
        error: 'You are not authorized to edit this user info!'
      });
    }

    const result = await UserRepository.updateUserInfo(req.body._id, req.body);

    res.json({ statusCode: 200, data: result });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
