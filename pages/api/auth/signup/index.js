import * as User from '../../../../model/User';
import bcrypt from 'bcryptjs';

export default async function (req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    await User.createNew(req.body);

    res.json({ statusCode: 200 });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
