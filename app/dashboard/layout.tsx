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
    <div className="grid grid-cols-12 h-screen">
      <Sidebar />
      <div className="col-span-12 lg:col-span-9 xl:col-span-10 h-screen flex flex-col ">
        <div className="p-6 bg-white text-sm  flex lg:justify-start justify-between ">
          <header>
            Welcome, <span className="font-bold">{user?.user_metadata?.display_name}</span>
          </header>

          <button className="lg:hidden block" onClick={()=> handleShowSidebar(true)}>
            <HamburgerMenu></HamburgerMenu>
          </button>

        </div>
        <main className="bg-gray-100/60 lg:rounded-tl-3xl p-4 md:p-6 lg:p-10 flex-1 overflow-y-auto">
          <div className="xl:max-w-7xl">
            {children}
          </div>
        </main>
      </div>
        {showSidebar && (
          <div className="absolute inset-0 z-10 bg-black/20 top-0 left-0 w-screen h-screen backdrop-blur-sm pointer-events-none"></div>
        )}
    </div>
  );
}
