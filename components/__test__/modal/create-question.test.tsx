import { CreateQuestionModal } from "@/components/modal/create-question";
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


describe("Create question modal",  () => {
    test("user can't create a question without answer", async () => {
        render(<CreateQuestionModal />, {wrapper: Wrapper})

        const openDialogButton = screen.getByRole("button", {name: "Create Question"})
        await userEvent.click(openDialogButton)

        const title = screen.getByLabelText("Title")
        const questionType = screen.getByLabelText("Question Type")
        const sectionId = screen.getByLabelText("Section")

        await userEvent.type(title, "Question 1")
        await userEvent.type(questionType, "second")
        await userEvent.type(sectionId, "10")


        const submitButton = screen.getByRole("button", {name: "Create Question"})
        await userEvent.click(submitButton)

        const { supabase } = require("@/lib/supabaseClient");
        expect(supabase.insert).not.toHaveBeenCalled()
    })

    test("user can create a question", async () => {
        render(<CreateQuestionModal />, {wrapper: Wrapper})

        const openDialogButton = screen.getByRole("button", {name: "Create Question"})
        await userEvent.click(openDialogButton)

        const title = screen.getByLabelText("Title")
        const questionType = screen.getByLabelText("Question Type")
        const sectionId = screen.getByLabelText("Section")
        const answer = screen.getByLabelText("Answer")

        await userEvent.type(title, "Question 1")
        await userEvent.type(questionType, "second")
        await userEvent.type(sectionId, "10")
        await userEvent.type(answer, "answer")


        const submitButton = screen.getByRole("button", {name: "Create Question"})
        await userEvent.click(submitButton)

        const { supabase } = require("@/lib/supabaseClient");
        expect(supabase.insert).toHaveBeenCalled()
    })
})