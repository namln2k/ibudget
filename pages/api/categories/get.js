import * as Category from '../../../models/Category';

export default async function (req, res) {
  try {
    let responseData;

    if (req.query.id) {
      responseData = await Category.getOneById(req.query.id);
    } else {
      responseData = await Category.getAllByUserId(req.query.userId);
      responseData.forEach((element, index) => {
        element.id = index + 1;
      });
    }

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
