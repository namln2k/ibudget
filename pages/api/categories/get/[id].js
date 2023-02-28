import * as utilHelper from '../../../../helpers/util';
import * as CategoryRepository from '../../../../repository/category';

export default async function handler(req, res) {
  const { id } = req.query;

  let responseData = await CategoryRepository.findById(id);

  const userId = await utilHelper.getUserIdFromRequest(req);

  if (responseData.user_id != userId) {
    res.json({
      statusCode: 401,
      error: 'You are not authorized to view this category'
    });
  }

  res.json({ statusCode: 200, data: responseData });
}
