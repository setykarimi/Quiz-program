import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabaseClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, queryByRole, render, screen } from "@testing-library/react";

// mock supabase
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));
const signOutMock = supabase.auth.signOut as jest.Mock;

// mock router & pathname
const replaceMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  usePathname: () => "/dashboard",
}));

// mock useAuth
jest.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    role: "admin",
  }),
}));

// mock useSetting
const handleShowSidebarMock = jest.fn();
jest.mock("@/context/setting-context", () => ({
  useSetting: () => ({
    showSidebar: true,
    handleShowSidebar: handleShowSidebarMock,
  }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
};

describe("sidebar", () => {
  test("Handle logout button", () => {
    render(<Sidebar />, { wrapper: Wrapper });
    const logOutBtn = screen.getByRole("button", { name: "Logout" });

    fireEvent.click(logOutBtn);
    expect(signOutMock).toHaveBeenCalled();
  });

  test("Show admin menus", () => {
    render(<Sidebar />, { wrapper: Wrapper });
    const options = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Exams", link: "/dashboard/exams" },
      { title: "Questions", link: "/dashboard/questions" },
      { title: "Users", link: "/dashboard/users" },
      { title: "Settings", link: "/settings" },    
    ];

    options.forEach(option => {
        expect(screen.queryByRole('link', {name: option.title})).toBeInTheDocument()
    });
  });

  test("Show Active class for active route", async () => {
    render(<Sidebar />, { wrapper: Wrapper });

    const dashboardLink = await screen.findByRole('link', {name: "Dashboard"})
    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveClass("bg-orange-600 text-white shadow-lg shadow-orange-200") 
  })
  
  test("Close mobile sidebar in mobile version", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    render(<Sidebar />, { wrapper: Wrapper });

    expect(handleShowSidebarMock).toHaveBeenCalledWith(false);
  })
});
