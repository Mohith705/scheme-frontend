"use client";

import LoginV2 from "@/components/Login/LoginV2";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  // useEffect(() => {
  //   // Check if the tenantName cookie exists
  //   const username = Cookies.get('username');

  //   // If the tenantName cookie exists, redirect to the dashboard
  //   if (!username) {
  //     router.push('/login');
  //   }
  // }, []);

  useEffect(() => {
    if (!localStorage.getItem("tenantName")) {
      router.push("/");
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden custom-scrollbar2">
      <LoginV2 />
    </div>
  );
}
