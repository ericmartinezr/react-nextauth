'use server';
import {
  FormState,
  SigninFormSchema,
  SignupFormSchema,
} from '../lib/definitions';
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, insertUser } from '@/db';
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  UserPayload,
} from '../lib/session';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are in valid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  const userInsertData = await insertUser(name, email, hashedPassword);
  const userData = await getUserById(userInsertData[0].id);

  if (!userData) {
    return {
      message: 'An error occurred while creating your account.',
    };
  } else {
    const tokenPayload: UserPayload = {
      userId: userData[0].id.toString(),
      name: userData[0].name,
    };
    const accessToken = await createAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken({
      userId: userData[0].id.toString(),
    });

    await setAuthCookies(accessToken, refreshToken);
    redirect('/dashboard');
  }
}

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

  // Prepare data for insertion into database
  const { email, password } = validatedFields.data;

  // Compare against db
  const userData = await getUserByEmail(email);
  if (!userData) {
    return {
      message: 'Invalid user',
    };
  }

  console.log('userData', userData);
  const result = await bcrypt.compare(password, userData[0].password);
  if (result) {
    const tokenPayload: UserPayload = {
      userId: userData[0].id.toString(),
      name: userData[0].name,
    };
    const accessToken = await createAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken({
      userId: userData[0].id.toString(),
    });

    await setAuthCookies(accessToken, refreshToken);

    redirect('/dashboard');
  } else {
    console.log('Invalid password');
    return {
      message: 'Invalid credentials',
    };
  }
}
