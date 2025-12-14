import { UpdateExamModal } from "@/components/modal/update-exam";
import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let updateMockFn;

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      update: jest.fn(() => {
        updateMockFn = jest.fn().mockResolvedValue({ error: null });
        return { eq: updateMockFn };
      }),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: null 
          })
        }))
      })),
    })),
  },
}));


let mutationFn: any;
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn((options) => {
    mutationFn = options.mutationFn;
    return { mutate: (data:any) => mutationFn(data), isPending: false };
  }),
  useQuery: jest.fn(),
  useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
}));



describe("update exam modal", () => { 
  
  test("show loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({ data: null, isLoading: true, isError: false });

    render(<UpdateExamModal id={4} open={true} setOpen={jest.fn()} />);
    expect(screen.getByText(/Loading .../i)).toBeInTheDocument();
  });

  test("show error state", () => {
    (useQuery as jest.Mock).mockReturnValue({ data: null, isLoading: false, isError: true });

    render(<UpdateExamModal id={4} open={true} setOpen={jest.fn()} />);
    expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading .../i)).not.toBeInTheDocument();
  });

  test("show empty state", () => {
    (useQuery as jest.Mock).mockReturnValue({ data: undefined, isLoading: false, isError: false });

    render(<UpdateExamModal id={4} open={true} setOpen={jest.fn()} />);
    expect(screen.queryByText("Loading ...")).not.toBeInTheDocument();
    expect(screen.getByText(/There is no Exam with this id/i)).toBeInTheDocument();
  });

  test("show form and submit", async () => {
  (useQuery as jest.Mock).mockReturnValue({
    data: {
      "id": 1,
      "created_at": "2025-11-04T13:04:43.956792+00:00",
      "title": "Sety",
      "description": "Description",
      "start_date": "2025-11-04",
      "end_date": "2025-11-15",
      "created_by": "7d94682b-b78c-4172-bd01-236c864b521d"
    },
    isLoading: false,
    isError: false,
  });

  const mockUpdate = jest.fn();
  const mockEq = jest.fn().mockResolvedValue({ error: null });
  
  mockUpdate.mockReturnValue({ eq: mockEq });

  const { supabase } = require("@/lib/supabaseClient");
  supabase.from = jest.fn(() => ({
    update: mockUpdate,
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ 
          data: {}, 
          error: null 
        })
      }))
    }))
  }));

  render(<UpdateExamModal id={4} open={true} setOpen={jest.fn()} />);

  const title = screen.getByLabelText(/Title/i);
  const startDate = screen.getByLabelText(/Start date/i);
  const endDate = screen.getByLabelText(/End date/i);
  const submitBtn = screen.getByRole('button', { name: /Update Exam/i });

  await userEvent.clear(title);
  await userEvent.type(title, "Exam 1");
  
  await userEvent.clear(startDate);
  await userEvent.type(startDate, "2025-11-08");
  
  await userEvent.clear(endDate);
  await userEvent.type(endDate, "2025-11-25");

  await userEvent.click(submitBtn);

  expect(mockUpdate).toHaveBeenCalledWith({
    title: "Exam 1",
    start_date: "2025-11-08",
    end_date: "2025-11-25",
    description: "Description"
  });
  
  expect(mockEq).toHaveBeenCalledWith("id", 4);
  });

});
