'use server';

import { redirect } from 'next/navigation';
import { clearAuthCookies } from '../lib/session';

export async function logoutAction() {
  'use server';
  await clearAuthCookies();
  redirect('/login');
}
