"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { login } from "@/server/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createAuthClient } from "better-auth/client";

export default function SignInForm() {
  const authClient = createAuthClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email déjà utiliser avec un autre provider!"
      : "";

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast.error(data.error);
          }
          if (data?.success) {
            form.reset();
            toast.success(data.success);
            router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", "w-full max-w-sm mx-auto")}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center gap-3 text-center whitespace-nowrap">
          <h1 className="text-2xl font-bold">Connectez-vous à votre compte</h1>
          <p className="text-muted-foreground text-xs text-balance ">
            Entrez votre email pour vous connecter à votre compte{" "}
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {urlError && <p className="text-red-500">{urlError}</p>}
          {/* Submit Button */}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Signing in..." : "Se connecter"}
          </Button>

          {/* Social Login Option */}
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Ou connectez-vous avec
            </span>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
              <path fill="#EA4335" d="M24 9.5c3.15 0 5.78 1.1 7.72 2.94l5.75-5.75C33.41 3.54 28.99 2 24 2 14.83 2 7.42 8.01 4.67 16.11l6.71 5.21C12.92 14.3 17.99 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.15 24.56c0-1.47-.13-2.88-.38-4.24H24v8.02h12.45c-.54 2.9-2.17 5.36-4.63 7.03l7.26 5.63c4.25-3.93 6.7-9.7 6.7-16.44z" />
              <path fill="#FBBC05" d="M10.48 28.52a14.49 14.49 0 0 1 0-9.04l-6.71-5.21a24 24 0 0 0 0 19.47l6.71-5.22z" />
              <path fill="#34A853" d="M24 46c6.49 0 11.93-2.15 15.91-5.84l-7.26-5.63c-2.01 1.36-4.59 2.17-8.65 2.17-6.01 0-11.08-4.8-12.62-11.13l-6.71 5.21C7.42 39.99 14.83 46 24 46z" />
            </svg>
            Se connecter avec Google
          </Button>


          {/* Sign up link */}
          <div className="text-center text-sm">
            Vous n&apos;avez pas de compte ?
            <a href="/auth/sign-up" className="underline underline-offset-4">
              S&apos;inscrire
            </a>
          </div>
        </div>
      </form>
    </Form>
  );
}
