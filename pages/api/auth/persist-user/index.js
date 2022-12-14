import * as jose from 'jose';
import * as UserRepository from '../../../../repository/user';

const secret = process.env.JWT_SECRET;

export default async function (req, res) {
  try {
    const jwt = req.cookies.JWT;

    const { payload, protectedHeader } = await jose.jwtVerify(
      jwt,
      new TextEncoder().encode(secret)
    );

    let user = await UserRepository.findByUsernameExcludePassword(payload.username);

    delete user.password;

    res.json({ statusCode: 200, data: user });
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
