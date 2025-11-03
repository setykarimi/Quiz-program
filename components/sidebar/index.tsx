"use client";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export function Sidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname()

  const routesByRole: Record<string, { title: string; link: string }[]> = {

    admin: [
      { title: "Exams", link: "/dashboard" },
      { title: "Questions", link: "/questions" },
      { title: "Users", link: "/users" },
      { title: "Settings", link: "/settings" },
    ],
    author: [
      { title: "Exams", link: "/exams" },
      { title: "Questions", link: "/questions" },
    ],
    student: [
      { title: "Exams", link: "/exams" },
    ],
    default: [],
  };


  const routes = routesByRole[role ?? "default"] || [];

  return (
    <div className="py-4 px-5 rounded-2xl bg-white flex flex-col gap-3 min-h-[calc(100vh-2rem)]">
      <h2 className="font-bold text-xl mb-4">Quiz Program</h2>

      {routes.map((route) => {
        const isActive = pathname == route.link
        return <Link
          key={route.link}
          href={route.link}
          className={`text-gray-700 hover:text-orange-600 font-medium px-3 py-2 rounded-lg ${isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-transparent"}`}
        >
          {route.title}
        </Link>
      })}
    </div>
  );
}
