import * as jose from 'jose';
import moment from 'moment/moment';
import mongoose from 'mongoose';

const SECRET = process.env.JWT_SECRET;

export function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function stringAvatar(name, sx = {}) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      ...sx
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

export function formatCurrency(amount) {
  return Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Math.abs(amount));
}

export async function getUserIdFromRequest(req) {
  const jwt = req.cookies.JWT;

  if (!jwt) {
    throw new Error('Invalid request: Some cookies is missing!');
  }

  const { payload, protectedHeader } = await jose.jwtVerify(
    jwt,
    new TextEncoder().encode(SECRET)
  );

  return payload.userId;
}

export function formatDate(date, format) {
  return moment(date).format(format);
}

export function isValidObjectId(string) {
  return mongoose.Types.ObjectId.isValid(string);
}
