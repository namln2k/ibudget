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
      .sort({ time: 'desc' })
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

export async function updateOne(query, transaction) {
  try {
    const result = await TransactionModel.findOneAndUpdate(query, {
      $set: transaction
    });

    return result;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findForRecord(userId, spendingType, categoryId) {
  try {
    let query = { user_id: userId };

    if (categoryId === 'none') {
      query = {
        ...query,
        category: { $exists: false }
      };
    } else if (categoryId) {
      query = {
        ...query,
        category: categoryId
      };
    }

    if (spendingType === 1) {
      query = {
        ...query,
        amount: { $gt: 0 }
      };
    } else if (spendingType === 2) {
      query = {
        ...query,
        amount: { $lt: 0 }
      };
    } else {
      if (query.amount) delete query.amount;
    }

    const transactions = await TransactionModel.find(query).exec();
    
    return transactions;
  } catch (error) {
    throw new Error(error.toString());
  }
}
