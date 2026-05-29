import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        if (credentials.username !== process.env.ADMIN_USER) return null;
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) return null;
        const valid = await bcrypt.compare(credentials.password as string, hash);
        if (!valid) return null;
        return { id: '1', name: 'Admin', email: process.env.ADMIN_USER as string };
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
