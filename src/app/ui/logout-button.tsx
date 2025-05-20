'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={async () => await signOut({ callbackUrl: '/login' })}
      className='btn w-full bg-[#515d6c] text-white border-none hover:bg-[#434d59]'>
      Logout
    </button>
  );
}
