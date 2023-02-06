import { serialize } from 'cookie';

export default async function (req, res) {
  const serialised = serialize('JWT', '', {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: -1,
    path: '/'
  });

  res.setHeader('Set-Cookie', serialised);
  res.json({ statusCode: 200 });
}
