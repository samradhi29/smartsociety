
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbconnect } from "@/app/lib/dbconnect";
import { ResidentModel } from "@/model/resident";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbconnect();
        const user = await ResidentModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error("No user found with this email or username");

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error("Incorrect password");

        return {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          role : user.role,
          society: user.society, 
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token._id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.society = token.society;
        session.user.role=token.role as string;
        // session.user.isAdmin = token.isAdmin as Boolean;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.society = user.society;
        token.role = user.role;
      }
      return token;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
export default authOptions;
