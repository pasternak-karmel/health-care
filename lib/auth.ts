import * as schema from "@/auth-schema";
import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    // sendResetPassword: async ({ user, url }) => {
    //   // gonna be implemented later
    //   // await sendPasswordResetEmail(user.email, url);
    // },
    requireEmailVerification: true,
  },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     // gonna be implemented later
  //     // await sendVerificationEmail(user.email, url);
  //   },
  // },
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
  plugins: [passkey(), twoFactor(), nextCookies()],
});
