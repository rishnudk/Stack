import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    apiToken: string;
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
  }
}
