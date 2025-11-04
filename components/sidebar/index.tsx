"use client";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname()

  const routesByRole: Record<string, { title: string; link: string }[]> = {

    admin: [
      { title: "Exams", link: "/dashboard/exams" },
      { title: "Questions", link: "/questions" },
      { title: "Users", link: "/users" },
      { title: "Settings", link: "/settings" },
    ],
    author: [
      { title: "Exams", link: "/dashboard/exams" },
      { title: "Questions", link: "/questions" },
    ],
    member: [
      { title: "Exams", link: "/dashboard/exams" },
    ],
    default: [],
  };


  const routes = routesByRole[role ?? "default"] || [];

  return (
    <div className="py-4 px-5 rounded-xl bg-white flex flex-col gap-3 min-h-[calc(100vh-2rem)]">
      <h2 className="font-bold text-xl mb-4">Quiz Program</h2>

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
    </div>
  );
}
