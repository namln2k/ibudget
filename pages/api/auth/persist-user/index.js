import * as jose from 'jose';
import * as User from '../../../../models/User';

const secret = process.env.JWT_SECRET;

export default async function (req, res) {
  try {
    const jwt = req.cookies.JWT;

    const { payload, protectedHeader } = await jose.jwtVerify(
      jwt,
      new TextEncoder().encode(secret)
    );

    const user = await User.getOneByUsername(payload.username);

    res.json({ statusCode: 200, data: user });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
