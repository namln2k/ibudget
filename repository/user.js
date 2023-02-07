import UserModel from '../models/User';

const ERR_CODE_DUPLICATE_KEY = 11000;

export async function create(user) {
  let result = user;
  user.balance = 0;

  try {
    await UserModel.create(user);
  } catch (error) {
    if (error.code === ERR_CODE_DUPLICATE_KEY) {
      throw new Error(Object.keys(error.keyPattern)[0] + ' must be unique!');
    }

    throw new Error(error.toString());
  }

  return result;
}

export async function findByUsername(username) {
  try {
    const user = await UserModel.findOne({ username: username }).exec();

    return user;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findByUsernameExcludePassword(username) {
  try {
    const user = await UserModel.findOne({ username: username })
      .select('-password')
      .exec();

    return user;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function updateBalance(userId, changeAmount) {
  try {
    const result = await UserModel.updateOne(
      { _id: userId },
      { $inc: { balance: parseFloat(changeAmount) } }
    );

    return result;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function getAllUserIds() {
  try {
    const userIds = await UserModel.find({}, '_id');

    return userIds;
  } catch (error) {
    throw new Error(error.toString());
  }
}

export async function findById(userId) {
  try {
    const user = await UserModel.find({
      _id: userId
    }).exec();

    if (user.length === 1) {
      return user[0];
    } else {
      throw new Error('Can not find user with _id = ' + userId);
    }
  } catch (error) {
    throw new Error(error.toString());
  }
}
