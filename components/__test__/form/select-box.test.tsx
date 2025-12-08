import { FormSelect } from "@/components/form/select-box"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SubmitHandler, useForm } from "react-hook-form"

type FormValues = {
    testSelect: string
}


const FormWrapper = () => {
    const {register, handleSubmit, formState: { errors }} = useForm<FormValues>({
        mode: "onSubmit"
    })

    const onSubmit:SubmitHandler<FormValues> = () => {}

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormSelect 
                label="Test Select"
                options={[{label: "test label", value: '1'}, {label: "test label", value: '2'} ]}
                register={register("testSelect", {required: "error test"})}
                error={errors.testSelect}
                placeholder="Choose..."
            />
            <button type="submit">Submit</button>
        </form>
    )
}

describe("Form Select", () => {
    test("renders select with label and options", () => {
        render(<FormWrapper />)
        // expect(screen.getByRole("option", { name: "Choose..." })).toBeInTheDocument()
        expect(screen.getByLabelText(/test select/i)).toBeInTheDocument()
        expect(screen.getAllByRole("option")).toHaveLength(2)
    })


    test("user can select the option", async () => {
        render(<FormWrapper />)

        const select = screen.getByLabelText(/Test Select/i) as HTMLInputElement
        expect(select).toBeInTheDocument()

        await userEvent.selectOptions(select, "2")
        expect(select.value).toBe("2")
    })


    test("show the error after form submit", async () => {
        render(<FormWrapper />)

        const button = screen.getByRole("button", {name: /submit/i})
        expect(button).toBeInTheDocument()

        await userEvent.click(button)
        expect(screen.getByText("error test")).toBeInTheDocument()

        const select = screen.getByLabelText(/Test Select/i) as HTMLInputElement
        await userEvent.selectOptions(select, "2")

        await userEvent.click(button)
        expect(screen.queryByText("error test")).not.toBeInTheDocument()
    })
})