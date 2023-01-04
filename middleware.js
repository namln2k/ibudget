import { NextResponse } from 'next/server';
import * as jose from 'jose';

const secret = process.env.JWT_SECRET;

const PROTECT_ROUTES = ['/dashboard', '/transaction'];

export default async function middleware(req) {
  const { cookies } = req;
  const jwt = cookies.get('JWT');
  const url = req.url;

  if (PROTECT_ROUTES.some((protectedRoute) => url.includes(protectedRoute))) {
    if (jwt === undefined) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      await jose.jwtVerify(jwt, new TextEncoder().encode(secret));

      return NextResponse.next();
    } catch (e) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
}
