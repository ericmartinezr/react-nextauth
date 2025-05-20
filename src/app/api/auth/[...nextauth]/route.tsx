import NextAuth, { NextAuthOptions } from 'next-auth';
import { getUserByEmail } from '@/db';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  secret: process.env.ACCESS_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = credentials?.username;
        const password = credentials?.password;

        if (email && password) {
          // Compare against db
          const userData = await getUserByEmail(email);
          if (!userData) {
            return {
              message: 'Invalid user',
            };
          }

          const result = await bcrypt.compare(password, userData[0].password);
          if (result) {
            return {
              id: userData[0].id,
              email: userData[0].email,
            };
          } else {
            return null;
          }
        }

        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
