import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      society : string;
    };
  }

  interface User {
    id?: string;
    username?: string;
    email?: string;
    society : string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    email?: string;
    society : string;
  }
}
