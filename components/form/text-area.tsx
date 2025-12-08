"use client";

import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
};

export const TextAreaInput :FC<Props> = ({ label, placeholder, register }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs" htmlFor={register.name}>{label}</label>}
      <textarea
        id={register.name}
        placeholder={placeholder}
        {...register}
        className={`bg-[#EDF5F4] px-4 py-3 outline-none rounded-lg text-sm placeholder:text-[#9EA3A2]`}
        rows={4}
      />
    </div>
  );
}