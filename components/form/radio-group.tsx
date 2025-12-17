"use client";

import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type RadioOption = {
  label: string;
  value: string;
};

type FormRadioGroupProps = {
  label: string;
  options: RadioOption[];
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export const FormRadioGroup: FC<FormRadioGroupProps> = ({
  label,
  options,
  register,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium mb-2">{label}</span>

      <div className="flex gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="radio"
              value={option.value}
              {...register}
              className={`w-4 h-4 border border-gray-400 ${
                error ? "border-red-700" : ""
              }`}
            />
            {option.label}
          </label>
        ))}
      </div>

      {error && <p className="text-red-700 text-xs">{error.message}</p>}
    </div>
  );
};
