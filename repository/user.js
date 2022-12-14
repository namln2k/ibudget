import UserModel from '../models/User';

const ERR_CODE_DUPLICATE_KEY = 11000;

export async function create(user) {
  let result = user;

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
