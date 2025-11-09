"use client";

import { question_types, section_types } from "@/data";
import { supabase } from "@/lib/supabaseClient";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "../form/input";
import { FormSelect } from "../form/select-box";

type FormInputs = {
  title: string;
  type: number;
  section_id: number;
  answer: string | number;
};

interface Props{
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    id: number | null
}

export const UpdateQuestionModal:FC<Props> = ({ open, setOpen, id }) => {
  const queryClient = useQueryClient();

  const { handleSubmit, register, formState: { errors }, reset } = useForm<FormInputs>({});

  const { data: question, isLoading, isError } = useQuery({
    queryKey: ["question_id", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("questions").select("*").eq("id", id).single(); 
      if (error) throw error;
      return data;
    },
    enabled: !!id, 
  });

  const mutation = useMutation({
    mutationFn: async (data: FormInputs) => {
      const { error } = await supabase.from("questions").update([data]).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question_id", id] });
      setOpen(false);
      reset()
    },
    onError: (error: any) => {
      console.log(error.message || "Failed to create question");
      reset()
    }
  });

  const onSubmit = (data: FormInputs) => {
    mutation.mutate(data);
  };

  useEffect(()=>{
    if(question) {
      reset({
        title: question.title, 
        answer: question.answer,
        section_id: question.section_id
      })
    }
  },[isLoading])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Update the Question
          </Dialog.Title>

            {isLoading ? "Loading ..." : isError ? "Error fetching data" : !question ? "There is no question with this id" : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormInput
                  label="Title"
                  register={register("title", { required: "Title is required" })}
                  error={errors.title}
                />
                
                <FormSelect options={question_types} register={register("type")} label="Question Type" />

                <FormSelect options={section_types} register={register("section_id")} label="Section" />
                
                <FormInput
                  label="Answer"
                  register={register("answer", { required: "Answer is required" })}
                  error={errors.title}
                />

                <div className="flex justify-end gap-2 mt-6">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
                      Cancel
                    </button>
                  </Dialog.Close>

                  <button type="submit" disabled={mutation.isPending} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                    {mutation.isPending ? "Updating..." : "Update Question"}
                  </button>
                </div>
              </form>
            )} 

         
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
