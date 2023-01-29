import * as CategoryRepository from '../../../repository/category';

export default async function (req, res) {
  try {
    const categoryId = req.query.id;

    const categoryToEdit = {
      name: req.body.name,
      description: req.body.description
    };

    const updatedCategory = await CategoryRepository.updateOne(
      { _id: categoryId },
      categoryToEdit
    );

    res.json({ statusCode: 200, data: updatedCategory });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
