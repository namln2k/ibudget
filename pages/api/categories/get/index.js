import * as utilHelper from '../../../../helpers/util';
import * as CategoryRepository from '../../../../repository/category';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    const responseData = await CategoryRepository.findByUserId(userId);

    responseData.forEach((element, index) => {
      element.index = index + 1;
      element.id = element._id;
    });

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
