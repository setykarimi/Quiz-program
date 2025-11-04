"use client";

import { Sidebar } from "@/components";
import { useAuth } from "@/context/auth-context";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="mx-auto max-w-350 grid gap-4 grid-cols-5">
        <Sidebar />
        <div className="col-span-4 h-fit">
          <div className="p-4 rounded-xl bg-white text-sm mb-4">Welcome, <span className="font-bold">{user?.user_metadata?.display_name}</span></div>
          <div className="bg-white p-4 rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
