import bcrypt from 'bcryptjs';
import * as UserRepository from '../../../repository/user';

export default async function (req, res) {
  try {
    const userId = req.body.userId;
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
        res.json({ statusCode: 400, error: 'Password not match!' });
      }
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
