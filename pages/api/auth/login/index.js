import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import * as userHelper from '../../../../helper/user';

const secret = process.env.JWT_SECRET;

export default async function (req, res) {
  const { username, password } = req.body;

  const user = await userHelper.getOneByUsername(username);

  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 60 * 60 * 24 * 30;

      const token = await new jose.SignJWT({
        exp,
        username
      })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));

      const serialised = serialize('JWT_TOKEN', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });

      res.setHeader('Set-Cookie', serialised);

      res.json({ statusCode: 200, data: user });
    } else {
      res.json({ statusCode: 400, message: 'Invalid credentials!' });
    }
  } else {
    res.json({
      statusCode: 400,
      message: 'Can not find any user with provided username!'
    });
  }
}
