import SignInForm from "@/components/auth/SignInForm";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Health Care
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={<div>Loading...</div>}>
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/welcome.jpeg"
          width={1000}
          height={1000}
          alt="Welcome picture"
          className="absolute inset-0 z-0 mix-blend-multiply h-full w-full"
        />
      </div>
    </div>
  );
}
