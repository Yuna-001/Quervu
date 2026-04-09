import authConfig from '@/auth.config';
import { authAdapter } from '@/lib/auth/adapter';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: authAdapter,
  events: {
    async createUser({ user }) {
      const db = client.db();
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(user.id) },
          { $set: { createdAt: new Date() } },
        );
    },
  },
  ...authConfig,
});
