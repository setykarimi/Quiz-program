"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CreateExamModal, DeleteConfirmDialog, UpdateExamModal } from "@/components";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { HamburgerMenu } from "iconsax-reactjs";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ExamSigninDialog } from "@/components/modal/exam-sign-in";
import { useRouter } from "next/navigation";

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const { role, user } = useAuth();
  const router = useRouter();

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) deleteHandler(selectedId);
    setDeleteDialogOpen(false);
  };

  const { data: exams, isLoading, isError, error } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: userExams } = useQuery({
    queryKey: ["user_exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_exams")
        .select("exam_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const registeredExamIds = userExams?.map((u) => u.exam_id) ?? [];

  const { mutate: deleteHandler } = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setOpen(false);
    },
  });

  const { mutate: signInExamHandler } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("user_exams").insert({
        exam_id: selectedId,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["user_exams"] });
      setExamDialogOpen(false);
      router.push("/dashboard/member/user-exams");
    },
  });

  const handleSignIn = (id: number) => {
    setSelectedId(id);
    setExamDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  if (isLoading)
    return <div className="text-gray-500 text-center my-10 animate-pulse">Loading exams...</div>;

  if (isError)
    return <div className="text-red-500 text-center my-10">Error loading exams: {error.message}</div>;

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
              {exams.map((item, index) => {
                const isRegistered = registeredExamIds.includes(item.id);

                return (
                  <tr key={index} className="border-t transition">
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
                      {role !== "member" ? (
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

                              {role === "admin" && (
                                <DropdownMenu.Item
                                  onClick={() => handleDeleteClick(item.id)}
                                  className="px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer outline-0"
                                >
                                  🗑️ Delete
                                </DropdownMenu.Item>
                              )}

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
                      ) : (
                        <button
                          disabled={isRegistered}
                          className={`py-1 px-2 rounded text-white transition-colors disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600`}
                          onClick={() => !isRegistered && handleSignIn(item.id)}
                        >
                          {isRegistered ? "Already Signed In" : "Sign In"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">You don’t have any exams yet.</p>
      )}

      <UpdateExamModal open={open} id={selectedId} setOpen={setOpen} />
      <ExamSigninDialog open={examDialogOpen} onConfirm={signInExamHandler} setOpen={setExamDialogOpen} />
      <DeleteConfirmDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} onConfirm={handleConfirmDelete} />
    </>
  );
}
