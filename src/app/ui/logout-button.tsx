'use client';

import { logoutAction } from '../actions/logout';

export default function LogoutButton() {
  // No need for useRouter if the action itself redirects
  // const router = useRouter();

  // The form submission will trigger the server action which handles redirect
  return (
    <form action={logoutAction}>
      <button
        type='submit'
        style={{
          padding: '8px 12px',
          marginTop: '20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}>
        Logout
      </button>
    </form>
  );
}
