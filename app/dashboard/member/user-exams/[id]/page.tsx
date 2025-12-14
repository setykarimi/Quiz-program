"use client";

import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function Page() {

  const params = useParams();
  const id = params.id;
  const {user} = useAuth()

  const { mutate: getQuestions, data: questionsData } = useMutation({
      mutationFn: async () => {
          const { data, error } = await supabase
          .rpc('get_user_exam_questions', {
              exam_id: id,
              user_uuid: user?.id
          });

          if (error) throw error;
          return data; // اینجا دیتا رو برگردون
      },
      onSuccess: (data) => {
          console.log("سوالات دریافت شد:", data);
      },
  });

  const { mutate: updateHanlder } = useMutation({
      mutationFn: async () => {
        const { error } = await supabase.from("user_exams").update({ status: 1 }).eq("exam_id", id).eq("user_id", user?.id);

        if (error) throw error;
      },
      onSuccess: () => {
      },
  });

  const handleYes = async () => {
      try {
          // اول آپدیت رو انجام بده، بعد سوالات رو بگیر
          await updateHanlder();
          getQuestions();
      } catch (error) {
          console.error("خطا:", error);
      }
  };

  const handleNo = () => {
    console.log("Canceled");
  };

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
