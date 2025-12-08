import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "../../form/input";

type FormValues = {
  testInput: string;
};

const FormWrapper = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    mode: "onSubmit" 
  });

  const onSubmit: SubmitHandler<FormValues> = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Test Input"
        placeholder="Enter value"
        register={register("testInput", { required: "Required" })}
        error={errors.testInput}
      />
      <button type="submit">Submit</button>
    </form>
  );
};


describe("Input test", () =>{
  test("renders input with label and placehollder", () => {
    render(<FormWrapper />)
    expect(screen.getByLabelText(/test input/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter value/i)).toBeInTheDocument()
  })

  test("allow user to test in input", async () => {
    render(<FormWrapper />)
    const input = screen.getByPlaceholderText("Enter value") as HTMLInputElement;

    await userEvent.type(input, 'hello world')
    expect(input.value).toBe("hello world")
  })

  test("shows error message", async () => {
     render(<FormWrapper />)
     const button = screen.getByRole('button', {name: /submit/i})
    const input = screen.getByPlaceholderText("Enter value") as HTMLInputElement;

     expect(button).toBeInTheDocument()

     await userEvent.click(button)
     expect(screen.getByText("Required")).toBeInTheDocument()


     await userEvent.type(input, 'hello world')
     await userEvent.click(button)
    expect(screen.queryByText("Required")).not.toBeInTheDocument()
  })
})