import NextAuth from 'next-auth';
  import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '../../../../lib/db/models/mongodb';
  import user from '../../../../lib/db/models/user';

  const authOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide email and password');
          }

          await dbConnect();

          const User = await user.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return { id: user._id.toString(), name: user.name, email: user.email };
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.id) {
          session.user.id = token.id;
        }
        return session;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

  const handler = NextAuth(authOptions);

  export { handler as GET, handler as POST };