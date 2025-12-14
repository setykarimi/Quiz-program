"use client";
import { ConfirmDialog, CreateQuestionModal, UpdateQuestionModal } from "@/components";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HamburgerMenu } from "iconsax-reactjs";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";
import { useState } from "react";

export default function QuestionsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId]= useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: questions, isLoading, isError, error } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("questions").select("*")
      if (error) throw error;
      return data;
    },
  });

  const {mutate: deleteHandler} = useMutation({
    mutationFn: async (id:number) => {
      const { error } = await supabase.from("questions").delete().eq("id", id); 
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setOpen(false);
    },
    onError: (error: any) => {
      console.log(error.message || "Failed to update question");
    }
  });

  const handleEdit = (id: number) =>  {
    setSelectedId(id)
    setOpen(true)
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteHandler(selectedId);
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) return (<div className="text-gray-500 text-center my-10 animate-pulse">Loading questions...</div>);

  if (isError) return (<div className="text-red-500 text-center my-10">Error loading questions: {error.message}</div>);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Questions List</h1>
        <CreateQuestionModal />
      </div>

      {questions?.length ? (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-100 z-0">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">#</th>
                <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Title</th>
                <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Type</th>
                <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Section</th>
                <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Answer</th>
                <th className="px-4 py-5 text-[13px] text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[300px]">{item.type || "—"}</td>
                  <td className="px-4 py-3 text-gray-400"> {item.section_id} </td>
                  <td className="px-4 py-3 text-gray-400"> {item.answer} </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 outline-0">
                          <HamburgerMenu className="w-5 h-5 text-gray-600" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-40 bg-white rounded-md shadow-lg border border-gray-100 p-1 text-sm"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            onClick={() => handleEdit(item.id)}
                            className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer outline-0"
                          >
                            ✏️ Edit
                          </DropdownMenu.Item>

                          <DropdownMenu.Item
                            onClick={() => handleDeleteClick(item.id)}
                            className="px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer outline-0"
                          >
                            🗑️ Delete
                          </DropdownMenu.Item>

                          <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />

                          <DropdownMenu.Item asChild>
                            <Link
                              href={`/dashboard/exams/${item.id}`}
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
          You don’t have any questions yet.
        </p>
      )}

      <UpdateQuestionModal open={open} id={selectedId} setOpen={setOpen}/>
      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        desc="This action cannot be undone. Do you really want to delete this item?"
        btnText="Delete"
        classNames="bg-red-600 hover:bg-red-700"
      />
    </>
  );
}
