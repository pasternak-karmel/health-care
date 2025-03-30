"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import LoginPage from "./login/page";

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
        <LoginPage/>
      )}
    </div>
  );
}
