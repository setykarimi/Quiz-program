import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth-context";
import { supabase } from "@/lib/supabaseClient";

// mock supabase
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

// mock router
const replaceMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const TestConsumer = () => {
  const { loading, role, user } = useAuth();

  if (loading) return <div>loading</div>;
  if (!user) return <div>no-user</div>;

  return <div>{role}</div>;
};

describe("Auth context", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
  });

  test("sets user and role when session exists", async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: {
            id: "1",
            app_metadata: { role: "admin" },
          },
        },
      },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("admin")).toBeInTheDocument();
    });
  });
});
