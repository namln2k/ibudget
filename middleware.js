import { NextResponse } from 'next/server';
import * as jose from 'jose';

const secret = process.env.JWT_SECRET;

export default async function middleware(req) {
  const { cookies } = req;
  const jwt = cookies.get('JWT_TOKEN');
  const url = req.url;

  if (url.includes('/dashboard')) {
    if (jwt === undefined) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      const verify = await jose.jwtVerify(
        jwt,
        new TextEncoder().encode(secret)
      );

      return NextResponse.next();
    } catch (e) {
      console.log(e);
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
