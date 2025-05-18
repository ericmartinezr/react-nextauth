import 'server-only';

import { JWTPayload, SignJWT, jwtVerify } from 'jose';

import { insertSession, updateSession as upSession } from '@/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const accessSecret = new TextEncoder().encode(process.env.ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_SECRET);

export interface UserPayload extends JWTPayload {
  userId: string;
  name: string; // Ensure this matches what your DAL provides
}

/**
 * Sets the access token and refresh token as HttpOnly cookies.
 * @param accessToken The access token.
 * @param refreshToken The refresh token.
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  const accessTokenExpiresInSeconds = parseTokenExpiration('15m');
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: accessTokenExpiresInSeconds,
    path: '/',
  });

  const refreshTokenExpiresInSeconds = parseTokenExpiration('1h');
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshTokenExpiresInSeconds,
    path: '/api/auth', // Refresh token cookie more scoped
  });
}

/**
 * Clears authentication cookies.
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

function parseTokenExpiration(expirationString: string): number {
  const unit = expirationString.slice(-1);
  const value = parseInt(expirationString.slice(0, -1), 10);
  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error('Invalid token expiration unit');
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;
  try {
    const { payload } = await jwtVerify<UserPayload>(accessToken, accessSecret);
    return payload;
  } catch (error) {
    console.error(
      'Access token verification failed during getSession:',
      (error as Error).message
    );
    return null;
  }
}

// (Include createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken as before)
// Example stubs for completeness - ensure these are fully implemented as in the previous step.
export async function createAccessToken(payload: UserPayload): Promise<string> {
  const expirationTime = '15m';
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(accessSecret);
}

export async function createRefreshToken(
  payload: Pick<UserPayload, 'userId'>
): Promise<string> {
  const expirationTime = '1h';
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(refreshSecret);
}

export async function verifyAccessToken(
  token: string
): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify<UserPayload>(token, accessSecret);
    return payload;
  } catch (error) {
    // console.error('Access token verification failed:', (error as Error).message);
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<Pick<UserPayload, 'userId'> | null> {
  try {
    const { payload } = await jwtVerify<Pick<UserPayload, 'userId'>>(
      token,
      refreshSecret
    );
    return payload;
  } catch (error) {
    // console.error('Refresh token verification failed:', (error as Error).message);
    return null;
  }
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, accessSecret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}
