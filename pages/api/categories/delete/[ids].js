import * as utilHelper from '../../../../helpers/util';
import * as CategoryRepository from '../../../../repository/category';

export default async function (req, res) {
  try {
    const { ids } = req.query;
    const categoryIds = JSON.parse(ids);

    const existedCategories = await CategoryRepository.findByManyIds(
      categoryIds
    );

    if (existedCategories.length != categoryIds.length) {
      res.json({
        statusCode: 400,
        error: 'One or more no longer exists! Please check selected'
      });
    }

    const userId = await utilHelper.getUserIdFromRequest(req);

    if (!existedCategories.every((category) => category.user_id == userId)) {
      res.json({
        statusCode: 401,
        error: 'You are not allowed to delete the category(s)!'
      });
    }

    const responseData = await CategoryRepository.deleteManyByIds(categoryIds);

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
