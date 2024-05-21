import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";
import GoogleProvider from "next-auth/providers/google";
/* import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; */
import { AuthOptions } from "next-auth";

const discordAuthScopes = ["user-read-email", "playlist-modify-public"].join(
  " "
);

export const authOptions: AuthOptions = {
  /* adapter: PrismaAdapter(prisma), */
  providers: [
    SpotifyProvider({
      clientId: <string>process.env.SPOTIFY_CLIENT_ID,
      clientSecret: <string>process.env.SPOTIFY_CLIENT_SECRET,
      authorization: { params: { scope: discordAuthScopes } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({
      token,
      account,
      profile,
      trigger,
      session,
    }: {
      token: any;
      account: any;
      profile?: any;
      trigger?: string;
      session?: any;
    }) {
      // Persist the OAuth access_token to the token right after signin
      // account will only result to true if this is the first time a user is signing up
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile.id;
      }

      /* // check if the user's serverId was added to the session, then add it to the jwt
      if (trigger === "update" && session?.serverId) {
        token.serverId = session.serverId;
      }

      // check if the stripeAccountId for the current user was added to the session, then add it to the jwt
      if (trigger === "update" && session?.stripeAccountId) {
        token.stripeAccountId = session.stripeAccountId;
      } */

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.id = token.id;

      /* // fetch the user's id from the database and add it to the session object
      const user: any = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      session.user.id = user.id;
      session.user.role = user.role; */

      return session;
    },
    /*  async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email_verified && profile?.email.endsWith("@example.com")
      }
      return true // Do different verification for other providers that don't have `email_verified`
    }, */
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
