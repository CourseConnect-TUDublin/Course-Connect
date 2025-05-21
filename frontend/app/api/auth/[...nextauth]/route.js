import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        studentId: { label: "Student ID", type: "text", placeholder: "B00XXXXXX" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          if (!credentials?.studentId || !credentials?.password) {
            throw new Error('Please enter your student ID and password');
          }

          // Construct email from student ID
          const email = `${credentials.studentId}@mytudublin.ie`;

          // Find user by email
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error('No user found with this student ID');
          }

          // Compare password
          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Return user object without password
          return {
            id: user._id.toString(),
            email: user.email,
            studentId: user.studentId,
            departmentId: user.departmentId.toString(),
            courseId: user.courseId.toString(),
            disciplineId: user.disciplineId.toString(),
            year: user.year,
            semester: user.semester,
            group: user.group
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.studentId = user.studentId;
        token.departmentId = user.departmentId;
        token.courseId = user.courseId;
        token.disciplineId = user.disciplineId;
        token.year = user.year;
        token.semester = user.semester;
        token.group = user.group;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.studentId = token.studentId;
        session.user.departmentId = token.departmentId;
        session.user.courseId = token.courseId;
        session.user.disciplineId = token.disciplineId;
        session.user.year = token.year;
        session.user.semester = token.semester;
        session.user.group = token.group;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 