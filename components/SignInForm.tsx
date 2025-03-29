"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_REDIRECT_URL } from "@/routes";
import { LoginSchema } from "@/schemas";
import { login } from "@/server/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState, useTransition } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email déjà utiliser avec un autre provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();

            if (data.error === "Please verify your email address") {
              setError(data.error);
            } else {
              setError(data.error);
            }
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            router.push(DEFAULT_REDIRECT_URL);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        </div>

        {error && <p className="text-red-500">{error || urlError}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
