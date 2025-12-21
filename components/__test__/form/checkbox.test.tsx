import { FormCheckbox } from "@/components/form/checkbox";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  checkboxInput: string;
};

const FormWrapper = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    mode: "onSubmit" 
  });

  const onSubmit: SubmitHandler<FormValues> = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCheckbox
        label="checkbox Input"
        register={register("checkboxInput", { required: "Required" })}
        error={errors.checkboxInput}
      />
      <button type="submit">Submit</button>
    </form>
  );
};


describe("Checkbox input", () =>{
  test("renders input with label and placehollder", () => {
    render(<FormWrapper />)
    expect(screen.getByLabelText(/checkbox Input/i)).toBeInTheDocument()
  })

  test("allow user to test in input", async () => {
    render(<FormWrapper />)
    const checkbox = screen.getByLabelText("checkbox Input") as HTMLInputElement;

    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  test("shows error message", async () => {
    render(<FormWrapper />)
    const button = screen.getByRole('button', {name: /submit/i})
    const checkbox = screen.getByLabelText("checkbox Input") as HTMLInputElement;

    expect(button).toBeInTheDocument()

    await userEvent.click(button)
    expect(screen.getByText("Required")).toBeInTheDocument()


    await userEvent.click(checkbox)
    await userEvent.click(button)
    expect(screen.queryByText("Required")).not.toBeInTheDocument()
  })
})