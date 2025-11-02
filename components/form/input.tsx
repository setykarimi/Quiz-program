"use client";

import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export const FormInput :FC<FormInputProps> = ({ label, type = "text", placeholder, register, error }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`bg-[#EDF5F4] px-4 py-3 outline-none rounded-lg text-sm border placeholder:text-[#9EA3A2] ${
          error ? "border-red-700" : "border-transparent"
        }`}
      />
      {error && <p className="text-red-700 text-xs">{error.message}</p>}
    </div>
  );
}