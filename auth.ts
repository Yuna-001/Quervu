import authConfig from '@/auth.config';
import client from '@/lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { ObjectId } from 'mongodb';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
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
