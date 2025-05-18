// app/api/auth/refresh/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  UserPayload,
  verifyRefreshToken,
} from '@/app/lib/session';
import { getUserById } from '@/db';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get('refreshToken')?.value;

  if (!refreshTokenValue) {
    return NextResponse.json(
      { message: 'Refresh token not found' },
      { status: 401 }
    );
  }

  try {
    const verifiedPayload = await verifyRefreshToken(refreshTokenValue);

    if (!verifiedPayload || !verifiedPayload.userId) {
      clearAuthCookies();
      return NextResponse.json(
        { message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Fetch user details using DAL to ensure the user still exists and get fresh info
    const user = await getUserById(Number(verifiedPayload.userId));
    if (!user) {
      clearAuthCookies();
      return NextResponse.json(
        { message: 'User not found for refresh token' },
        { status: 401 }
      );
    }

    const userTokenPayload: UserPayload = {
      userId: user[0].id.toString(), // from DAL
      name: user[0].name, // from DAL
      // Add any other claims needed for UserPayload
    };
    const newAccessToken = await createAccessToken(userTokenPayload);

    // Optional: Issue a new refresh token (for refresh token rotation)
    const newRefreshToken = await createRefreshToken({
      userId: user[0].id.toString(),
    });

    setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json(
      { success: true, message: 'Token refreshed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    clearAuthCookies();
    return NextResponse.json(
      { message: 'Internal server error during token refresh' },
      { status: 500 }
    );
  }
}
