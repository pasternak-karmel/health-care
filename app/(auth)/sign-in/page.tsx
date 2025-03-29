import SignInForm from "@/components/SignInForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <SignInForm />

      <p className="mt-4 text-gray-700">
        Pas encore de compte ?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sinscrire ici
        </Link>
      </p>
    </div>
  );
}
