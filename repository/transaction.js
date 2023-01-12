import TransactionModel from '../models/Transaction';

export async function create(transaction) {
  let result = transaction;

  try {
    await TransactionModel.create(transaction);
  } catch (error) {
    throw new Error(error.toString());
  }

  return result;
}

export async function findByUserId(userId) {
  try {
    const transactions = await TransactionModel.find({
      user_id: userId
    }).exec();

    return transactions;
  } catch (error) {
    throw new Error(error.toString());
  }
}
