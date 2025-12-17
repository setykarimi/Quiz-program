"use client";

import { FormCheckbox } from "@/components/form/checkbox";
import { useAuth } from "@/context/auth-context";
import { IQuestion } from "@/data";
import { supabase } from "@/lib/supabaseClient";
import { getQuestionType } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
                                                    
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();
  const { register } = useForm();

  const { data: examStatus, isLoading: loadingStatus, isError: examStatusError } = useQuery({
    queryKey: ["user-exam-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_exams")
        .select("status")
        .eq("exam_id", id)
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { mutate: getQuestions, data: questionsData, isPending, isError } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("get_user_exam_questions",
        {
          p_exam_id: Number(id),  
          p_user_uuid: user!.id,
        }
      );

      if (error) throw error;
      return data;
    },
  });
  
  const { mutate: updateHanlder } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_exams")
        .update({ status: 1 })
        .eq("exam_id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {},
  });

  const handleYes = async () => {
    try {
      updateHanlder();
      getQuestions();
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  const handleNo = () => {
    console.log("Canceled");
  };

  useEffect(()=> {
    if(examStatus?.status == 1) getQuestions()
  },[user, examStatus])

  if (isPending || loadingStatus) {
    return <div>Loading ...</div>;
  }

  if (isError || examStatusError) {
    return <div>Error ...</div>;
  }

  if (examStatus?.status == 1 && questionsData) {
    return (
      <form>
        <div className="flex flex-col gap-4">
          {questionsData.map((question: IQuestion) => (
            <div>{getQuestionType(question) }</div>
          ))}
        </div>

        <button type="submit"
          // disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 text-sm mt-4">Submit form</button>
      </form>
    );
  }

  if(examStatus?.status == 0) {
    return (
    <div className="max-w-sm mx-auto p-6 ">
      <h2 className="text-lg font-bold mb-2 text-gray-800">
        Are you sure you want to start the exam?
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        After starting the exam, the timer and rules may activate.
      </p>

      <div className="h-px bg-gray-200 my-4" />

      <div className="flex gap-3">
        <button
          onClick={handleYes}
          className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          Yes
        </button>

        <button
          onClick={handleNo}
          className="flex-1 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
        >
          No
        </button>
      </div>
    </div>
  );
  }

}
