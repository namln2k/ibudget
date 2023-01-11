import * as CategoryRepository from '../../../repository/category';

export default async function (req, res) {
  try {
    const responseData = await CategoryRepository.findByUserId(
      req.query.userId
    );

    responseData.forEach((element, index) => {
      element.id = index + 1;
    });

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
