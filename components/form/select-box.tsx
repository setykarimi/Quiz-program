"use client";

import { FC } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormSelectProps = {
  label?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  options: { label: string; value: string | number }[];
  placeholder?: string;
};

export const FormSelect: FC<FormSelectProps> = ({
  label,
  register,
  error,
  options,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-600" htmlFor={register.name}>{label}</label>}
      <div className="relative">
        <select
          id={register.name}
          {...register}
          className={`bg-[#EDF5F4] text-gray-800 px-4 py-3 outline-none rounded-lg text-sm border placeholder:text-[#9EA3A2] appearance-none w-full cursor-pointer
            ${error ? "border-red-700" : "border-transparent"}
            focus:ring-2 focus:ring-orange-300 transition-all
          `}
          defaultValue=""
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white text-gray-700 hover:bg-orange-100 py-2"
            >
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          ▼
        </span>
      </div>

      {error && <p className="text-red-700 text-xs mt-1">{error.message}</p>}
    </div>
  );
};
