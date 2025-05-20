'use client';

import { useActionState, useEffect } from 'react';
import { signup } from '../actions/auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Register() {
  const [state, action, pending] = useActionState(signup, undefined);
  useEffect(() => {
    if (state?.success) {
      signIn('credentials', {
        username: state.username,
        password: state.password,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    }
  }, [state]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-base-200'>
      <form
        action={action}
        className='card w-full max-w-md bg-zinc-900 border border-primary shadow-xl p-8 space-y-6'>
        <h2 className='text-2xl font-bold text-center text-base-content mb-4'>
          Sign Up
        </h2>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-base-content mb-1'>
            Name
          </label>
          <input
            id='name'
            name='name'
            type='name'
            placeholder='Name'
            className='input w-full bg-base-100 border border-primary/40 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-200 shadow-sm rounded-xl text-lg py-4 px-4'
            autoComplete='name'
          />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-base-content mb-1'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='Email'
            className='input w-full bg-base-100 border border-primary/40 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-200 shadow-sm rounded-xl text-lg py-4 px-4'
            autoComplete='email'
          />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-base-content mb-1'>
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            className='input w-full bg-base-100 border border-primary/40 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-200 shadow-sm rounded-xl text-lg py-4 px-4'
            autoComplete='current-password'
          />
        </div>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          disabled={pending}
          type='submit'
          className='btn btn-primary w-full text-base-100 font-semibold'>
          {pending ? 'Creating account...' : 'Create account'}
        </button>

        <div className='text-center text-xs'>
          <Link href={'/login'}>Sign in</Link>
        </div>
      </form>
    </div>
  );
}
