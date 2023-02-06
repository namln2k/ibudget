import mongoose from 'mongoose';
import * as RecordRepository from '../../../repository/record';
import * as UserRepository from '../../../repository/user';
import * as TransactionRepository from '../../../repository/transaction';
import * as CategoryRepository from '../../../repository/category';

const prepareAmount = (transactions) => {
  return transactions.reduce(
    (total, transaction) => total + parseFloat(transaction.amount.toString()),
    0
  );
};

const prepareRecord = async (
  userId,
  initialRecord,
  spendingType,
  categoryType,
  categoryId
) => {
  let recordToAdd = {
    ...initialRecord,
    spending_type: spendingType,
    category_type: categoryType
  };

  let transactions = [];

  if (categoryType === 1) {
    transactions = await TransactionRepository.findForRecord(
      userId,
      spendingType,
      'none'
    );
  } else if (categoryType === 2) {
    recordToAdd = {
      ...recordToAdd,
      category_id: categoryId
    };

    transactions = await TransactionRepository.findForRecord(
      userId,
      spendingType,
      categoryId
    );
  }

  recordToAdd = {
    ...recordToAdd,
    amount: prepareAmount(transactions)
  };

  return recordToAdd;
};

export default async function (req, res) {
  try {
    let recordsToAdd = [];
    let addedCount = 0;
    /**
     * Set time type of record: 1 - Daily
     */
    let recordToAdd = {
      time_type: 1
    };

    const users = await UserRepository.getAllUserIds();
    const userIds = users.map((user) => user._id);

    let i = 0;

    for (i = 0; i < userIds.length; i++) {
      const userId = userIds[i];

      // Set user_id for record
      recordToAdd = {
        ...recordToAdd,
        user_id: userId
      };

      const user = await UserRepository.findById(userId);

      // User balance
      recordsToAdd.push({
        ...recordToAdd,
        spending_type: 3,
        amount: parseFloat(user.balance.toString())
      });

      // Total income of transactions that does not belong to any category
      let preparedRecord = await prepareRecord(userId, recordToAdd, 1, 1);
      recordsToAdd.push(preparedRecord);

      // Total expense of transactions that does not belong to any category
      preparedRecord = await prepareRecord(userId, recordToAdd, 2, 1);
      recordsToAdd.push(preparedRecord);

      const categories = await CategoryRepository.findByUserId(userId);

      // Total income of transactions by category id
      for (i = 0; i < categories.length; i++) {
        preparedRecord = await prepareRecord(
          userId,
          recordToAdd,
          1,
          2,
          categories[i]._id
        );
        recordsToAdd.push(preparedRecord);
      }

      // Total expense of transactions by category id
      for (i = 0; i < categories.length; i++) {
        preparedRecord = await prepareRecord(
          userId,
          recordToAdd,
          2,
          2,
          categories[i]._id
        );
        recordsToAdd.push(preparedRecord);
      }
    }

    for (i = 0; i < recordsToAdd.length; i++) {
      await RecordRepository.create(recordsToAdd[i]);

      addedCount++;
    }

    res.json({ statusCode: 200, data: { addedCount } });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
