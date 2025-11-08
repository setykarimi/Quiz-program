"use client";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ExamClient() {
  const params = useParams();
  const id = params.id;


  const { data: exam, isLoading, isError } = useQuery({
    queryKey: ["exam", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("id", id)
        .single(); 
      if (error) throw error;
      return data;
    },
    enabled: !!id, 
  });

  return <div>Exam ID: {id}</div>;
}
