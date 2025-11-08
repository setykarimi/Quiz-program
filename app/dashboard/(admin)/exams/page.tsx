"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CreateExamModal } from "@/components";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { HamburgerMenu } from "iconsax-reactjs";

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

  // --- Fake Handlers (توی پروژه واقعی خودت پیاده کن)
  const handleEdit = (id: number) => alert(`Edit exam ${id}`);
  const handleDelete = (id: number) => alert(`Delete exam ${id}`);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Exams List</h1>
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
                <tr key={item.id} className="border-t transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[300px]">
                    {item.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(item.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(item.end_date).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 outline-0">
                          <HamburgerMenu className="w-5 h-5 text-gray-600" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[160px] bg-white rounded-md shadow-lg border border-gray-100 p-1 text-sm"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            onClick={() => handleEdit(item.id)}
                            className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer outline-0"
                          >
                            ✏️ Edit
                          </DropdownMenu.Item>

                          <DropdownMenu.Item
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer outline-0"
                          >
                            🗑️ Delete
                          </DropdownMenu.Item>

                          <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />

                          <DropdownMenu.Item asChild>
                            <Link
                              href={`/exams/${item.id}`}
                              className="block px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50 outline-0"
                            >
                              🔍 View Details
                            </Link>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
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
