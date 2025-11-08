"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { FormInput } from "../form/input";
import { TextAreaInput } from "../form/text-area";

type FormInputs = {
  title: string;
  start_date: string;
  end_date: string;
  description: string;
};

export default function AlertDialogDemo() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // state کنترل modal

  const { handleSubmit, register, control, formState: { errors }, reset } = useForm<FormInputs>({
    defaultValues: { start_date: "", end_date: "" }
  });

  const startDate = useWatch({ control, name: "start_date" });

  const mutation = useMutation({
    mutationFn: async (data: FormInputs) => {
      const { error } = await supabase.from("exams").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setOpen(false);
      reset()
    },
    onError: (error: any) => {
      console.log(error.message || "Failed to create exam");
      reset()
    }
  });

  const onSubmit = (data: FormInputs) => {
    mutation.mutate(data);
   
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition">
          Create an Exam
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Create New Exam
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
              label="Title"
              register={register("title", { required: "Title is required" })}
              error={errors.title}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                type="date"
                label="Start date"
                register={register("start_date", { required: "Start date is required" })}
                error={errors.start_date}
              />

              <FormInput
                type="date"
                label="End date"
                register={register("end_date", {
                  required: "End date is required",
                  validate: value => !startDate || value >= startDate || "End date must be after start date"
                })}
                error={errors.end_date}
                min={startDate}
              />
            </div>

            <TextAreaInput
              label="Description"
              register={register("description")}
              error={errors.description}
            />

            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
                  Cancel
                </button>
              </Dialog.Close>

              <button type="submit" disabled={mutation.isPending} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                {mutation.isPending ? "Creating..." : "Create Exam"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
