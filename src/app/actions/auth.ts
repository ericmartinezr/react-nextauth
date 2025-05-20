'use server';
import { FormState, SignupFormSchema } from '../lib/definitions';
import bcrypt from 'bcrypt';
import { getUserById, insertUser } from '@/db';

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
      success: false,
      message: 'An error occurred while creating your account.',
    };
  } else {
    return {
      success: true,
      username: email,
      password,
    };
  }
}
