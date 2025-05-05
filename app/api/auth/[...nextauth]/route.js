import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import user from '../../../../lib/db/models/user';
import { dbConnect } from '../../../../lib/db/models/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        await dbConnect();
        
        const User = await user.findOne({ email: credentials.email });
        
        if (!User) {
          throw new Error('Invalid email: No user found with this email');
        }
        
        const isValidPassword = await bcrypt.compare(credentials.password, User.password);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: User._id,
          email: User.email,
          name: `${User.firstName} ${User.lastName}`,
        };
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + '/dashboard';
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };