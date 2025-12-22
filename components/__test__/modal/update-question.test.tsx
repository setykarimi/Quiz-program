import { UpdateQuestionModal } from "@/components/modal/update-question";
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
            error: null,
          }),
        })),
      })),
    })),
  },
}));

let mutationFn: any;
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn((options) => {
    mutationFn = options.mutationFn;
    return { mutate: (data: any) => mutationFn(data), isPending: false };
  }),
  useQuery: jest.fn(),
  useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
}));

describe("update question modal", () => {
  test("show loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<UpdateQuestionModal id={4} open={true} setOpen={jest.fn()} />);
    expect(screen.getByText(/Loading .../i)).toBeInTheDocument();
  });

  test("show error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<UpdateQuestionModal id={4} open={true} setOpen={jest.fn()} />);
    expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading .../i)).not.toBeInTheDocument();
  });

  test("show empty state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(<UpdateQuestionModal id={4} open={true} setOpen={jest.fn()} />);
    expect(screen.queryByText("Loading ...")).not.toBeInTheDocument();
    expect(screen.getByText(/There is no question with this id/i)).toBeInTheDocument();
  });

  test("show form and submit", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {},
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
            error: null,
          }),
        })),
      })),
    }));

    render(<UpdateQuestionModal id={4} open={true} setOpen={jest.fn()} />);

    const title = screen.getByLabelText(/Title/i);
    const type = screen.getByLabelText(/Question Type/i);
    const section_id = screen.getByLabelText(/Section/i);
    const answer = screen.getByLabelText(/Answer/i);
    const submitBtn = screen.getByRole("button", { name: /Update Question/i });

    await userEvent.clear(title);
    await userEvent.type(title, "Exam 1");

    await userEvent.clear(answer);
    await userEvent.type(answer, "my answer");

    await userEvent.selectOptions(section_id, "10");

    await userEvent.selectOptions(type, "text");

    await userEvent.click(submitBtn);

    expect(mockUpdate).toHaveBeenCalledWith({
      title: "Exam 1",
      answer: "my answer",
      section_id: "10",
      type: "text",
    });

    expect(mockEq).toHaveBeenCalledWith("id", 4);
  });
});
