import { CreateExamModal } from "@/components/modal/create-exam";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ error: null }),
  },
}));


const Wrapper = ({children}:any) => (
    <QueryClientProvider client={new QueryClient()}>
        {children}
    </QueryClientProvider>
)


describe("Create exam modal",  () => {
    test("user can create an exam", async () => {
        render(<CreateExamModal />, {wrapper: Wrapper})

        const openDialogButton = screen.getByRole("button", {name: "Create an Exam"})
        await userEvent.click(openDialogButton)

        const title = screen.getByLabelText("Title")
        const startDate = screen.getByLabelText("Start date")
        const endDate = screen.getByLabelText("End date")

        await userEvent.type(title, "Exam 1")
        await userEvent.type(startDate, "2025-01-01")
        await userEvent.type(endDate, "2025-01-02")

        const submitButton = screen.getByRole("button", {name: "Create Exam"})
        await userEvent.click(submitButton)

        const { supabase } = require("@/lib/supabaseClient");
        expect(supabase.insert).toHaveBeenCalled()
    })
})