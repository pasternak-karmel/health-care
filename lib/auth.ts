import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",     
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [
        nextCookies()
    ]

});

// npx @better-auth/cli generate --config lib/auth.ts --output prisma/schema.prisma