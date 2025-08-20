"use client";

import { Spinner } from "@/components/general/Spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const AuthPage = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    // Since we use direct wallet connection, redirect to home
    router.push("/");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner />
      <p className="mt-4 text-gray-600">Redirecting to wallet connection...</p>
    </div>
  );
};

export default AuthPage;
