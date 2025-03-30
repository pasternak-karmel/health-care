"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const isConnected = session?.user?.email;
  return (
    <div>
      {isConnected ? (
        <div>
          <Button>go the dashboard</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Link href={"/auth/sign-in"}>Sign In</Link>
          <Link href={"/auth/sign-up"}>Sign Up</Link>
        </div>
      )}
    </div>
  );
}
