"use client";

import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormCheckboxProps = {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export const FormCheckbox: FC<FormCheckboxProps> = ({ label, register, error }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          {...register}
          className={`w-4 h-4 rounded border border-gray-400 ${
            error ? "border-red-700" : ""
          }`}
        />
        {label}
      </label>
      {error && <p className="text-red-700 text-xs">{error.message}</p>}
    </div>
  );
};
