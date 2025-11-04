"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type ExamFormData = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
};

export default function CreateExamForm() {
  const queryClient = useQueryClient();
  const router = useRouter()

  // ⚙️ React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExamFormData>();

  // ⚙️ React Query mutation
  const { mutateAsync: createExam, isPending } = useMutation({
    mutationFn: async (data: ExamFormData) => {
      const { error } = await supabase.from("exams").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] }); // 🔁 refetch exams list
      reset();
      router.push("/dashboard/exams")
    },
    onError: (err: any) => {
    }
  });

  // 📤 submit handler
  const onSubmit = async (data: ExamFormData) => {
    await createExam(data);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">Create New Exam</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            {...register("start_date", { required: "Start date is required" })}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            {...register("end_date", { required: "End date is required" })}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Create Exam"}
        </button>
      </form>
    </div>
  );
}
