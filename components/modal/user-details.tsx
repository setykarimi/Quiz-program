"use client";

import { supabase } from "@/lib/supabaseClient";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormSelect } from "../form/select-box";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string | null;
}

type FormInputs = {
  exam_id: number;
};

export const UserDetailsModal: FC<Props> = ({ open, setOpen, id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: userExams, isLoading, isError, error } = useQuery({
    queryKey: ["user_exams", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_exams")
        .select(`exam_id,exams (id,title,description,start_date,end_date)`)
        .eq("user_id", id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: exams, isLoading: examLoading, isError: examError } = useQuery({
  queryKey: ["available-exams", id],
  queryFn: async () => {
      const assignedIds = userExams?.map((ue: any) => ue.exam_id) || [];
      const { data, error } = await supabase
      .from("exams")
      .select("*")
      .not("id", "in", `(${assignedIds.join(",")})`);
      if (error) throw error;
      return data;
  },
  enabled: !!id && !!userExams, 
  });

  const addExamMutation = useMutation({
    mutationFn: async (data: FormInputs) => {
      const { error } = await supabase
        .from("user_exams")
        .insert({user_id: id, exam_id: +data.exam_id});
      if (error) throw error;
    },
    onSuccess: () => {
      setDrawerOpen(false);
      queryClient.invalidateQueries({ queryKey: ["user_exams", id] });
    },
  });

  const { handleSubmit, register, reset } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => {
    addExamMutation.mutate(data);
    reset();
  };

  useEffect(()=> {
    queryClient.invalidateQueries({ queryKey: ["available-exams", id] });
  },[drawerOpen])

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <div
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40
              ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setOpen(false)}
          />

          <Dialog.Content
            onClick={(e) => e.stopPropagation()}
            className={`fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 
              bg-white rounded-xl p-6 shadow-lg transition-transform duration-300 z-50`}
          >
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              User Exams
            </Dialog.Title>

            {isLoading ? (
              "Loading..."
            ) : isError ? (
              `Error: ${error.message}`
            ) : !userExams?.length ? (
              "No exams found for this user."
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {userExams.map((exam: any) => (
                  <li
                    key={exam.exam_id}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer"
                    onClick={() => router.push(`/dashboard/exams/${exam.exam_id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{exam.exams.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {exam.exams.start_date} → {exam.exams.end_date}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {exam.exams.description || "No description"}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setDrawerOpen(true)}
            >
              Add Exam
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <div
            className={`fixed inset-0 bg-black/20 transition-opacity duration-300 z-50
              ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setDrawerOpen(false)}
          />

          <Dialog.Content
            onClick={(e) => e.stopPropagation()}
            className={`fixed top-0 right-0 h-full w-[90vw] max-w-sm bg-white shadow-xl p-6 
              transform transition-transform duration-300 ease-in-out z-60
              ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Add Exam to User
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {examLoading  ? <span>Loading ...</span> : !examError && exams?.length ?  <FormSelect register={register("exam_id", { required: true })} options={exams ? exams?.map((exam)=>  {
                    return {
                        label: exam.title,
                        value: exam.id
                    }
                }) : []}/> : <span>No Exam fround</span>}
                
              

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addExamMutation.isPending || examLoading || examError || exams?.length == 0}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-300 disabled:text-gray-100 disabled:cursor-not-allowed"
                >
                  {addExamMutation.isPending ? "Adding..." : "Add Exam"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
