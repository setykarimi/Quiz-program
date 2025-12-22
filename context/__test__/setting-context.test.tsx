import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { SettingProvider, useSetting } from "../setting-context";

export const TestConsumer = () => {
  const { showSidebar, handleShowSidebar } = useSetting();

  return (
    <div>
      <span data-testid="sidebar-status">
        {showSidebar ? "open" : "closed"}
      </span>

      <button onClick={() => handleShowSidebar(true)}>open</button>
    </div>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <SettingProvider>{children}</SettingProvider>;
};

describe("SettingContext", () => {
  test("default showSidebar is false", () => {
    render(<TestConsumer />, { wrapper: Wrapper });

    expect(screen.getByTestId("sidebar-status").textContent).toBe("closed");
  });

  test("handleShowSidebar updates state", async () => {
    const user = userEvent.setup();
    render(<TestConsumer />, { wrapper: Wrapper });

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("sidebar-status").textContent).toBe("open");
  });
});
