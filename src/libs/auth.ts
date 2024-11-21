import type { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email?: string;
          password?: string;
        };
        // Handle email login
        if (email && password) {
          try {
            const res = await fetch(`${process.env.API_URL}/auth/signin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
              const errorJson = await res.json();
              const errorMessage = errorJson.Message || "An error occurred";
              throw new Error(errorMessage);
            }
            const data = await res.json();

            if (data.ResponseStatus === "failure") {
              throw new Error(data.Message || "Login again");
            }

            if (data.ResponseStatus === "success") {
              const user = {
                id: data.ResponseData.UserId,
                name: data.ResponseData.Username,
                email,
                token: data.ResponseData.Token,
                refresh_token: data.ResponseData.RefreshToken,
                tokenExpiry: data.ResponseData.TokenExpiry,
                refreshTokenExpiry: data.ResponseData.RefreshTokenExpiry,
              };
              return user;
            }

            throw new Error("Unexpected response status");
          } catch (e: any) {
            throw new Error(e.message);
          }
        }
        throw new Error("Invalid credentials");
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.userId;
        token.name = user.name;
        token.email = user.email;
        token.token = user.token;
        token.refresh_token = user.refresh_token;
        token.tokenExpiry = user.tokenExpiry;
        token.refreshTokenExpiry = user.refreshTokenExpiry || 0;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id || token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.token = token.token;
        session.user.refresh_token = token.refresh_token;
        session.user.tokenExpiry = token.tokenExpiry;
        session.user.refreshTokenExpiry = token.refreshTokenExpiry;
      }
      return session;
    },
  },
};
