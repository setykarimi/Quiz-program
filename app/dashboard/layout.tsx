"use client";

import { Sidebar } from "@/components";
import { useAuth } from "@/context/auth-context";
import { useSetting } from "@/context/setting-context";
import { HamburgerMenu } from "iconsax-reactjs";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showSidebar, handleShowSidebar } = useSetting();
  
  return (
    <div className="bg-gray-100 min-h-screen p-4 relative">
      <div className="mx-auto max-w-350 grid gap-4 grid-cols-5">
        <Sidebar />
        <div className="lg:col-span-4 col-span-5 h-fit relative">
          <div className="p-4 rounded-xl bg-white text-sm mb-4 flex lg:justify-start justify-between">
           <span>
             Welcome, <span className="font-bold">{user?.user_metadata?.display_name}</span>
           </span>

            <button className="lg:hidden block" onClick={()=> handleShowSidebar(true)}>
              <HamburgerMenu></HamburgerMenu>
            </button>

          </div>
          <div className="bg-white p-4 rounded-xl relative z-0">
            {children}
          </div>
        </div>
         {showSidebar && (
            <div className="absolute inset-0 z-10 bg-black/20 top-0 left-0 w-screen h-screen backdrop-blur-sm pointer-events-none"></div>
          )}
      </div>
    </div>
  );
}
