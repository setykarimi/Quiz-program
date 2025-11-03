"use client";

import { Sidebar } from "@/components";
import { AuthProvider } from "@/context/auth-context";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="mx-auto max-w-350 grid gap-5 grid-cols-5">
          <Sidebar />
          <div className="p-3 rounded-lg bg-white col-span-4 h-fit">
            {/* <div>Welcome, {user?.user_metadata?.display_name}</div> */}
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
