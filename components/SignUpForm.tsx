"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/server/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/routes";

// interface SignUpFormProps {
//   onSubmit: (data: {
//     email: string;
//     password: string;
//     name: string;
//     confirmPassword: string;
//   }) => void;
// }

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    alert("dd");
    setLoading(true);

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
              toast.error(data.error);
          }
          if (data?.success) {
            form.reset();
            toast.success(data.success);
            router.push(LOGIN_URL);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 border rounded shadow-md bg-white"
      >
        <h2 className="text-xl font-bold text-center mb-4">Créer un compte</h2>

        <Input
          placeholder="Nom"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Mot de passe"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          placeholder="Confirmet Mot de passe"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  );
}
