"use client";
import { useAuth } from "@/context/auth-context";
import { useSetting } from "@/context/setting-context";
import { supabase } from "@/lib/supabaseClient";
import { CloseSquare, Logout } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Sidebar() {
  const { role } = useAuth();
  const router = useRouter()
  const { handleShowSidebar, showSidebar } = useSetting()
  const pathname = usePathname()

  const routesByRole: Record<string, { title: string; link: string }[]> = {
    admin: [
      { title: "Dashboard", link: "/dashboard"},
      { title: "Exams", link: "/dashboard/exams" },
      { title: "Questions", link: "/dashboard/questions" },
      { title: "Users", link: "/dashboard/users" },
      { title: "Settings", link: "/settings" },
    ],
    author: [
      { title: "Dashboard", link: "/dashboard"},
      { title: "Exams", link: "/dashboard/exams" },
      { title: "Questions", link: "/questions" },
    ],
    member: [
      { title: "Dashboard", link: "/dashboard"},
      { title: "Exams", link: "/dashboard/exams" },
    ],
    default: [],
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.replace("/login") 
    }
  }

  const routes = routesByRole[role ?? "default"] || [];

  return (
    <div className={`bg-white flex-col gap-3 py-4 px-5 ${showSidebar ? "z-20 flex fixed top-0 left-0 h-screen rounded-none w-60" : "lg:flex hidden rounded-xl min-h-[calc(100vh-2rem)]"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl ">Quiz Program</h2>
        <button className="lg:hidden block" onClick={()=> handleShowSidebar()}>
          <CloseSquare />
        </button>
      </div>

      {routes.map((route) => {
        const isActive = pathname == route.link
        return <Link
          key={route.link}
          href={route.link}
          className={`text-gray-700 hover:bg-orange-100 font-medium px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-transparent"}`}
        >
          {route.title}
        </Link>
      })}

      <button className="mt-auto text-left text-gray-700 hover:bg-orange-100 font-medium p-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer" onClick={()=>handleLogout()}>
        <Logout />
        Logout
      </button>
    </div>
  );
}
