import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getUserById } from '@/db';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('accessToken')?.value;
  const session = await decrypt(cookie);

  console.log('cookie', cookie);
  console.log('session', session);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await getUserById(session.userId);

    const user = data[0];

    return user;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});
