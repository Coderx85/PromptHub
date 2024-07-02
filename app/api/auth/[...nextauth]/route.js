import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],

  callbacks: {
    async session({ session }) {
      // store the user id fr om MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });
        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    }
  }
})

export { handler as GET, handler as POST };