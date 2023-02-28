import * as utilHelper from '../../../../helpers/util';
import * as CategoryRepository from '../../../../repository/category';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);
    req.body.user_id = userId;

    const addedCategory = await CategoryRepository.create(req.body);

    res.json({ statusCode: 200, data: addedCategory });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
