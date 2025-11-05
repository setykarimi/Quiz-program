import { useState } from "react";

export default function CreateExamModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="w-8 h-8 text-2xl text-center bg-orange-600 rounded-md text-white shadow transition cursor-pointer" onClick={()=> setOpen(true)}>
        +
      </button>
    </>
  );
}
