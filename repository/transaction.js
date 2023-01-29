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
    })
      .populate('category')
      .exec();
    return transactions;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findById(transactionId) {
  try {
    const transaction = await TransactionModel.find({
      _id: transactionId
    })
      .populate('category')
      .exec();

    if (transaction.length === 1) {
      return transaction[0];
    } else {
      throw new Error(
        'Transaction not found or has been deleted. Please refresh the page and try again!'
      );
    }
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function deleteOne(transactionId) {
  try {
    const deletedCount = TransactionModel.deleteOne({ _id: transactionId });

    return deletedCount;
  } catch (error) {
    throw new Error(error.toString());
  }
}
