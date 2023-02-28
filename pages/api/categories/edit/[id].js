import * as utilHelper from '../../../../helpers/util';
import * as CategoryRepository from '../../../../repository/category';

export default async function (req, res) {
  try {
    const { id: categoryId } = req.query;

    const existedCategory = await CategoryRepository.findById(categoryId);

    if (!existedCategory) {
      res.json({ statusCode: 400, error: 'Category no longer exists!' });
    }

    const userId = await utilHelper.getUserIdFromRequest(req);

    if (existedCategory.user_id != userId) {
      res.json({
        statusCode: 401,
        error: 'You are not allowed to edit this category!'
      });
    }

    const updatedCategory = await CategoryRepository.updateOne(
      { _id: categoryId },
      req.body
    );

    res.json({ statusCode: 200, data: updatedCategory });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
