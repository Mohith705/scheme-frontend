"use client";

import Dashboard from "@/components/Dashboard/Dashboard"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

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
            <Dashboard />
        </div>
    );
}
