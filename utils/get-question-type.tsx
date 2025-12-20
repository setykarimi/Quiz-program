import { IQuestion } from "@/data";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FormCheckbox, FormInput, FormRadioGroup, FormSelect } from '@/components/index'

export function getQuestionType(question: IQuestion, register:UseFormRegister<FieldValues>) {
  const {title, id, type} = question
  switch (type) {
    case "checkbox":
      return <FormCheckbox label={title} register={register(`${id}`)}  />
      
    case "radio":
      return <FormRadioGroup label={title} options={[{label: "label", value: 'value'},{label: "label 2", value: 'value 2'}]} register={register(`${id}`)}/>;
    case "select":
      return <FormSelect options={[]} register={register(`${id}`)} label={title}/>;
    case "text":
      return <FormInput label={title} register={register(`${id}`)} />
    case "number":
      return <FormInput label={title} register={register(`${id}`)} type="number"/>
    default:
      return "unknown";
  }
}
