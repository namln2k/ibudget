import * as UserRepository from '../../../../repository/user';
import bcrypt from 'bcryptjs';

export default async function (req, res) {
  try {
    // Encrypt user's password before saving
    req.body.password = await bcrypt.hash(req.body.password, 8);

    const result = await UserRepository.create(req.body);

    res.json({ statusCode: 200, data: result });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
