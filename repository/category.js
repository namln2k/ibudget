import CategoryModel from '../models/Category';

const ERR_CODE_DUPLICATE_KEY = 11000;

export async function create(category) {
  let result = category;

  try {
    await CategoryModel.create(category);
  } catch (error) {
    if (error.code === ERR_CODE_DUPLICATE_KEY) {
      throw new Error(Object.keys(error.keyPattern)[0] + ' must be unique!');
    }

    throw new Error(error.toString());
  }

  return result;
}

export async function findByUserId(userId) {
  try {
    const categories = await CategoryModel.find({
      user_id: userId
    })
      .lean()
      .exec();

    return categories;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function deleteManyByIds(ids) {
  try {
    const deletedCount = CategoryModel.deleteMany({ _id: { $in: ids } });

    return deletedCount;
  } catch (error) {
    throw new Error(error.toString());
  }
}
