import * as utilHelper from '../../../../helpers/util';
import * as UserRepository from '../../../../repository/user';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    const user = await UserRepository.findByIdExcludePassword(userId);

    res.json({ statusCode: 200, data: user });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
