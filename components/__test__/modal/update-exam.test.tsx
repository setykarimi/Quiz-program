import { UpdateExamModal } from "@/components/modal/update-exam";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    form: jest.fn().mockReturnThis(),
    update: jest.fn().mockResolvedValue({ error: null }),
  },
}));

const Wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
};


describe('update exam modal', () => { 
  test("show loading state", () => {
    jest.mock('@tanstack/react-query', () => ({
      useQuery: jest.fn(),
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        isPending: false,
      })),
      useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
      }))
    }));

    

    render(<UpdateExamModal id={1} open={true} setOpen={jest.fn()}/>, { wrapper: Wrapper })
    expect(screen.getByText("Loading ...")).toBeInTheDocument()
  })

  
})