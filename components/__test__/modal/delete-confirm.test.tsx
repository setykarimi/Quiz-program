import { DeleteConfirmDialog } from "@/components/modal/delete-confirm"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("delete confirm", () => {
    
    const setOpen = jest.fn()
    const onConfirm = jest.fn()

    test("renders dialog content when open", () => {
        render(<DeleteConfirmDialog onConfirm={onConfirm} open={true} setOpen={setOpen}/>)
       
        expect(screen.getByText(/Are you sure\?/i)).toBeInTheDocument()
        expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
        expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: /Delete/i})).toBeInTheDocument()
    })

    test("Calls setOpen(false) when cancel is clicked", async () => {
        render(<DeleteConfirmDialog onConfirm={onConfirm} open={true} setOpen={setOpen}/>)
        
        const cancelButton = screen.getByRole('button', {name: /Cancel/i})
        await userEvent.click(cancelButton)

        expect(setOpen).toHaveBeenCalledWith(false)
    })

    test("Calls onConfirm when delete is clicked", async () => {
        render(<DeleteConfirmDialog onConfirm={onConfirm} open={true} setOpen={setOpen}/>)

        const deleteButton = screen.getByRole("button", {name: /Delete/i})
        await userEvent.click(deleteButton)

        expect(onConfirm).toHaveBeenCalled
    })
    
})