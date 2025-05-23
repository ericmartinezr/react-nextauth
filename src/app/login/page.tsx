'use client';

import { signIn } from 'next-auth/react';
import { useActionState } from 'react';
import { FormState, SigninFormSchema } from '../lib/definitions';
import Link from 'next/link';

export async function signin(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are in valid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await signIn('credentials', {
    username: formData.get('email'),
    password: formData.get('password'),
    redirect: true,
    callbackUrl: '/dashboard',
  });

  if (!result?.ok) {
    return {
      message: 'Invalid credentials',
    };
  }
}

export default function Login() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div className='flex min-h-screen items-center justify-center bg-base-200'>
      <form
        action={action}
        className='card w-full max-w-md bg-zinc-900 border border-primary shadow-xl p-8 space-y-6'>
        <h2 className='text-2xl font-bold text-center text-base-content mb-4'>
          Sign In
        </h2>
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

        <button
          disabled={pending}
          type='submit'
          className='btn btn-primary w-full text-base-100 font-semibold'>
          {pending ? 'Signing In...' : 'Sign In'}
        </button>

        <div className='text-center text-xs'>
          <Link href={'/register'}>Create account</Link>
        </div>

        {state?.message && <p>{state.message}</p>}
      </form>
    </div>
  );
}
