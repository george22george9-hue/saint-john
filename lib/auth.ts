import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production';
export const AUTH_COOKIE_NAME = 'admin_token';

export interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export function signToken(payload: { id: number; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(req?: NextRequest): Promise<DecodedToken | null> {
  // 1. Try to get token from HttpOnly Cookie
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    // Fallback to Bearer token header if present
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}
