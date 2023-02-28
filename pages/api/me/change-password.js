import * as utilHelper from '../../../helpers/util';
import bcrypt from 'bcryptjs';
import * as UserRepository from '../../../repository/user';

export default async function (req, res) {
  try {
    const userId = await utilHelper.getUserIdFromRequest(req);

    if (req.body._id != userId) {
      res.json({
        statusCode: 401,
        error: 'You are not authorized to edit this user info!'
      });
    }
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.password;

    const userResponse = await UserRepository.findById(userId);

    if (userResponse?.password) {
      const isPasswordMatch = await bcrypt.compare(
        confirmPassword,
        userResponse?.password
      );

      const newPasswordHashed = await bcrypt.hash(newPassword, 8);

      if (isPasswordMatch) {
        const result = await UserRepository.updateUserInfo(userId, {
          password: newPasswordHashed
        });

        res.json({ statusCode: 200, result });
      } else {
        res.json({ statusCode: 400, error: 'Password is not valid!' });
      }
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
