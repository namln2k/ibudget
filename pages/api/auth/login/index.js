import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import * as jose from 'jose';
import * as UserRepository from '../../../../repository/user';

const secret = process.env.JWT_SECRET;

export default async function (req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.findByUsername(username);

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 60 * 60 * 24 * 30;

        delete user.password;

        const token = await new jose.SignJWT({
          exp,
          userId: user._id
        })
          .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
          .setExpirationTime(exp)
          .setIssuedAt(iat)
          .setNotBefore(iat)
          .sign(new TextEncoder().encode(secret));

        const serialised = serialize('JWT', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 60 * 24 * 30,
          path: '/'
        });

        res.setHeader('Set-Cookie', serialised);

        res.json({ statusCode: 200, data: user });
      } else {
        res.json({
          statusCode: 400,
          error:
            'Invalid login credentials! Please double check your username and password then try again!'
        });
      }
    } else {
      res.json({
        statusCode: 400,
        error:
          'Invalid login credentials! Please double check your username and password then try again!'
      });
    }
  } catch (error) {
    res.json({ statusCode: 400, error: error.toString() });
  }
}
