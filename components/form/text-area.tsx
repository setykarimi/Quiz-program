"use client";

import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export const TextAreaInput :FC<Props> = ({ label, placeholder, register, error }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs">{label}</label>}
      <textarea
        placeholder={placeholder}
        {...register}
        className={`bg-[#EDF5F4] px-4 py-3 outline-none rounded-lg text-sm placeholder:text-[#9EA3A2]`}
        rows={4}
      />
    </div>
  );
}