import { UserDetailsModal } from "@/components/modal/user-details";
import { supabase } from "@/lib/supabaseClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { useMemo } from "react";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// ۱. شبیه‌سازی Supabase
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: Infinity,
          },
        },
      }),
    []
  );
  // const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

function RenderComponent() {
  return render(<UserDetailsModal id="1" open={true} setOpen={jest.fn()} />, {
    wrapper: Wrapper,
  });
}

describe("user details modal", () => {
  test("test open user details modal", async () => {
    (supabase.from as any).mockImplementation(() => ({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: [
              {
                exam_id: 1,
                exams: {
                  title: "Math Exam",
                  description: "Algebra 101",
                  start_date: "2025-12-16",
                  end_date: "2025-12-30",
                },
              },
            ],
            error: null,
          }),
      }),
    }));
    RenderComponent();

    expect(await screen.findByText("Math Exam")).toBeInTheDocument();
    expect(screen.getByText("Algebra 101")).toBeInTheDocument();
  });

  test("open the Drawer on click add Btn", async () => {
    RenderComponent();

    expect(screen.queryByText("Add Exam to User")).not.toBeInTheDocument();

    const addButton = screen.getByText("Add Exam");
    fireEvent.click(addButton);

    expect(await screen.findByText("Add Exam to User")).toBeInTheDocument();
  });

  test("Show Error message if fetching data  has error", async () => {
    (supabase.from as any).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Database connection failed" },
      }),
    }));
    RenderComponent();

    const errorMessage = await screen.findByText(/Database connection failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("Show empty state on empty data", async () => {
    (supabase.from as any).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [],
        error: false,
      }),
    }));
    RenderComponent();

    expect(
      await screen.findByText(/No exams found for this user./i)
    ).toBeInTheDocument();
  });

  test("on click on exam redirect to exam page", async () => {
    (supabase.from as any).mockImplementation(() => ({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: [
              {
                exam_id: 1,
                exams: {
                  title: "Math Exam",
                  description: "Algebra 101",
                  start_date: "2025-12-16",
                  end_date: "2025-12-30",
                },
              },
            ],
            loading: false,
            error: null,
          }),
      }),
    }));
    RenderComponent();

    const examItem = await screen.findByText("Math Exam");
    expect(examItem).toBeInTheDocument();
    fireEvent.click(examItem);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/exams/1");
  });

  test("When there is no exam show the no exam found", async () => {
    (supabase.from as any).mockImplementation((tableName: string) => {
      if (tableName === "user_exams") {
        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [{ exam_id: 1 }], error: null }),
          }),
        };
      }
      if (tableName === "exams") {
        return {
          select: () => ({
            not: () => Promise.resolve({ data: [], error: null }), // لیست خالی
          }),
        };
      }
    });

    render(<UserDetailsModal id="1" open={true} setOpen={jest.fn()} />, {
      wrapper: Wrapper,
    });

    fireEvent.click(screen.getByText(/Add Exam/i));

    const emptyMessage = await screen.findByText(/No Exam fround/i);
    expect(emptyMessage).toBeInTheDocument();
  });

});
