import { IQuestion } from "@/data";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FormCheckbox, FormInput } from '@/components/index'

export function getQuestionType(question: IQuestion, register:UseFormRegister<FieldValues>) {
  switch (question.type) {
    case "checkbox":
      return <FormCheckbox label={question.title} register={register(question.title)}  />
      
    case "radio":
      return "radio";
    case "select":
      return "select";
    case "text":
      return <FormInput label={question.title} register={register(question.title)} />
    case "number":
      return <FormInput label={question.title} register={register(question.title)} type="number"/>
    default:
      return "unknown";
  }
}
