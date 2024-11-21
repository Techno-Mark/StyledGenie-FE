import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token: string;
  refresh_token: string;
  expires_at: string;
}
  

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
