import { IQuestion } from "@/data";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FormCheckbox, FormInput, FormRadioGroup, FormSelect } from '@/components/index'

export function getQuestionType(question: IQuestion, register:UseFormRegister<FieldValues>) {
  const {title, id, type} = question
  switch (type) {
    case "checkbox":
      return <FormCheckbox label={title} register={register(question.title)}  />
      
    case "radio":
      return <FormRadioGroup label={title} options={[{label: "label", value: 'value'},{label: "label 2", value: 'value 2'}]} register={register(`${id}-${title}`)}/>;
    case "select":
      return <FormSelect options={[]} register={register(`${id}-${title}`)} label={title}/>;
    case "text":
      return <FormInput label={title} register={register(`${id}-${title}`)} />
    case "number":
      return <FormInput label={title} register={register(`${id}-${title}`)} type="number"/>
    default:
      return "unknown";
  }
}
