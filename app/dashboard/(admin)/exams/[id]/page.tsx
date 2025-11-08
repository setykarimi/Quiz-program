"use client";
import { useParams } from "next/navigation";

export default function ExamClient() {
  const params = useParams();
  const id = params.id;

  return <div>Exam ID: {id}</div>;
}
