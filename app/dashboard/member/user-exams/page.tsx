"use client";

import { DeleteConfirmDialog } from "@/components";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Exam {
  title: string;
  start_date: string;
  end_date: string;
}

interface UserExam {
  id: number;
  exam_id: number;
  exams: Exam;
}

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: userExams, isLoading, isError, error } = useQuery<UserExam[]>({
    queryKey: ["user_exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_exams")
        .select(`id,exam_id,exams(title,start_date,end_date)`)
        .order("id", { ascending: false });

      if (error) throw error;
      return data as any
    },
  });

  const { mutate: deleteHandler } = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("user_exams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_exams"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete exam");
    },
  });

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleStartExam = (id:number) =>{

  }

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteHandler(selectedId);
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading)
    return (
      <div className="text-gray-500 text-center my-10 animate-pulse">
        Loading exams...
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center my-10">
        Error loading exams: {(error as any).message}
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">User Exams</h1>
      </div>

      {userExams?.length ? (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-100">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Start Date</th>
                <th className="px-4 py-3 text-left">End Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userExams.map((item, index) => {
                const endDate = new Date(item?.exams?.end_date);
                const startDate = new Date(item?.exams?.start_date);
                const today = new Date();

                const isExpired = endDate < today;

                return (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3 font-medium">
                      {item?.exams?.title}
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {startDate.toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {endDate.toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isExpired ? (
                        <span className="text-red-500 font-semibold">Expired</span>
                      ) : (
                        <div>
                          <button
                            className="px-2 py-2 rounded-md text-green-600 hover:bg-green-50 cursor-pointer outline-0"
                            onClick={() => handleStartExam(item.id)}
                          >
                            Run
                          </button>

                          <button className="px-2 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer outline-0" onClick={() => handleDeleteClick(item.id)} >
                            🗑️ 
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">
          You don’t have any exams yet.
        </p>
      )}

      {/* Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
