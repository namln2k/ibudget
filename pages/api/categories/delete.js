import * as CategoryRepository from '../../../repository/category';

export default async function (req, res) {
  try {
    const responseData = await CategoryRepository.deleteManyByIds(
      JSON.parse(req.query.ids)
    );

    res.json({ statusCode: 200, data: responseData });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
