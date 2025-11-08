"use client";
import CreateExamModal from "@/components/modal/create-exam";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function ExamsPage() {
  const { data: exams, isLoading, isError, error } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exams").select("*").order("id", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="text-gray-500 text-center mt-10 animate-pulse">
        Loading exams...
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center mt-10">
        Error loading exams: {error.message}
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📘 My Exams</h1>
        <CreateExamModal />
      </div>

      {exams?.length ? (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-100 z-0">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Started At</th>
                <th className="px-4 py-3 text-left">End At</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[300px]">
                    {item.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400"> {new Date(item.start_date).toLocaleDateString()} </td>
                  <td className="px-4 py-3 text-gray-400"> {new Date(item.end_date).toLocaleDateString()} </td>
                 
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/exams/${item.id}`}
                      className="text-orange-600 hover:text-indigo-800 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">
          You don’t have any exams yet.
        </p>
      )}
    </>
  );
}
