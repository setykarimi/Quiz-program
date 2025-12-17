import { IQuestion } from "@/data";

export function getQuestionType(question: IQuestion) {
  switch (question.type) {
    case "checkbox":
      return "checkbox";
    case "radio":
      return "radio";
    case "select":
      return "select";
    case "text":
      return "text";
    case "number":
      return "number";
    default:
      return "unknown";
  }
}
