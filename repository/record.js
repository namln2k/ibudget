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

export async function findByUserId(userId) {
  try {
    const records = await RecordModel.find({
      user_id: userId
    }).exec();
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
