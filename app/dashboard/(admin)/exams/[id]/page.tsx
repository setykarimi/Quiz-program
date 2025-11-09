"use client";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  questions: number[];
};

export default function ExamClient() {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();

  const { data: exam, isLoading, error, isError } = useQuery({
    queryKey: ["exam", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("exams").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("questions").select("*").order("id");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: examQuestions } = useQuery({
    queryKey: ["exam-questions", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("exam_questions").select("question_id").eq("exam_id", id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { questions: [] }
  });

  useEffect(() => {
    if (examQuestions) {
      reset({ questions: examQuestions.map(q => q.question_id) });
    }
  }, [examQuestions, reset]);

  const assignQuestionsMutation = useMutation({
    mutationFn: async (newSelected: number[]) => {
      await supabase.from("exam_questions").delete().eq("exam_id", id);

      if (newSelected.length > 0) {
        const insertData = newSelected.map(qId => ({ exam_id: id, question_id: qId }));
        const { error } = await supabase.from("exam_questions").insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exam-questions", id] }),
  });

  const onSubmit = (data: FormValues) => {
    assignQuestionsMutation.mutate(data.questions);
  };

  if (isLoading || loadingQuestions) return <div className="text-gray-500 text-center my-10 animate-pulse">Loading exam...</div>;
  if (isError) return <div className="text-red-500 text-center my-10">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div><span className="text-sm">Title:</span> <span className="font-medium">{exam?.title}</span></div>
        <div><span className="text-sm">Start Date:</span> <span className="font-medium">{exam?.start_date}</span></div>
        <div><span className="text-sm">End Date:</span> <span className="font-medium">{exam?.end_date}</span></div>
        <div className="col-span-3"><span className="text-sm">Description:</span> <span className="font-medium">{exam?.description || "—"}</span></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="font-bold mb-2 border-t border-t-gray-200 pt-4">Questions</h3>
        <Controller
          name="questions"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col max-h-96 overflow-y-auto">
              {questions?.map(q => (
                <label key={q.id} className="flex items-center gap-2 px-2 hover:bg-gray-100 cursor-pointer border-b border-b-gray-200 py-4">
                  <input
                    type="checkbox"
                    checked={field.value.includes(q.id)}
                    onChange={() => {
                      if (field.value.includes(q.id)) {
                        field.onChange(field.value.filter((v: number) => v !== q.id));
                      } else {
                        field.onChange([...field.value, q.id]);
                      }
                    }}
                    className="w-3 h-3"
                  />
                  <span className="text-sm">{q.title}</span>
                </label>
              ))}
            </div>
          )}
        />
        <button
          type="submit"
          disabled={assignQuestionsMutation.isPending}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {assignQuestionsMutation.isPending ? "Saving..." : "Save Assignments"}
        </button>
      </form>
    </div>
  );
}
