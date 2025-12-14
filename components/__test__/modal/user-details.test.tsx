import { UserDetailsModal } from "@/components/modal/user-details";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("user details modal", () => {
  test("test open user details modal", () => {
    render(<UserDetailsModal id="4" open={true} setOpen={jest.fn()} />, { wrapper: Wrapper });
    expect(screen.getByText("User Exams")).toBeInTheDocument();
  });
});
