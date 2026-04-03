import authConfig from '@/auth.config';
import client from '@/lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  ...authConfig,
});
