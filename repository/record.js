import RecordModel from '../models/Record';

export async function create(record) {
  let result = record;

  try {
    await RecordModel.create(record);
  } catch (error) {
    throw new Error(error.toString());
  }

  return result;
}

export async function findByUserId(userId, timeType = 1) {
  try {
    const records = await RecordModel.find({
      user_id: userId,
      time_type: timeType
    })
      .populate('category_id')
      .lean()
      .exec();

    return records;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findById(recordId) {
  try {
    const record = await RecordModel.find({
      _id: recordId
    }).exec();

    if (record.length === 1) {
      return transaction[0];
    } else {
      throw new Error(
        'Some records not found or have been deleted. Please refresh the page and try again!'
      );
    }
  } catch (error) {
    throw new Error(error.toString());
  }
}
