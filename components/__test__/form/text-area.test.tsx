import { TextAreaInput } from "@/components/form/text-area";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

interface FormValues {
  testTextArea: string;
}

const FormWrapper = () => {
  const { register } = useForm<FormValues>({
    mode: "onSubmit",
  });

  return (
    <form>
      <TextAreaInput
        register={register("testTextArea")}
        label="testTextArea"
        placeholder="write ..."
      />
    </form>
  );
};


describe("Textarea", () => {
    test("render input with label and placeholder", () => {
        render(<FormWrapper />)
        expect(screen.getByLabelText(/testTextArea/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/write .../i)).toBeInTheDocument()
    })

    test("allow user to test in input", async () => {
        render(<FormWrapper />)
        const textarea = screen.getByLabelText(/testTextArea/i) as HTMLInputElement

        await userEvent.type(textarea, "hello from textarea")
        expect(textarea.value).toBe("hello from textarea")
    })
})
