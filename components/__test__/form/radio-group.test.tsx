import { FormCheckbox } from "@/components/form/checkbox";
import { FormRadioGroup } from "@/components/form/radio-group";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  radioInput: string;
};


const options = [{label: "مرد", value: "men"}, {label: "زن", value: "female"}]

const FormWrapper = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    mode: "onSubmit" 
  });

  const onSubmit: SubmitHandler<FormValues> = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormRadioGroup
        label="gender"
        register={register("radioInput", { required: "Required" })}
        options={options}
        error={errors.radioInput}
      />
      <button type="submit">Submit</button>
    </form>
  );
};


describe("Checkbox input", () =>{
  test("renders input", () => {
    render(<FormWrapper />)
    expect(screen.getByText("gender")).toBeInTheDocument()
  })

  test("renders radio input with label and options", () => {
    render(<FormWrapper />)
    options.forEach(item => expect(screen.getByLabelText(item.label)).toBeInTheDocument())
  })

  test("allow user to test in radio input", async () => {
    render(<FormWrapper />)
    const maleRadio = screen.getByLabelText(options[0].label) as HTMLInputElement;

    await userEvent.click(maleRadio)
    expect(maleRadio).toBeChecked()
  })
})