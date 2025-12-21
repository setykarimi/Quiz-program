import { render, screen } from "@testing-library/react";
import { SettingProvider, useSetting } from "../setting-context";
import userEvent from "@testing-library/user-event";

export const TestConsumer = () => {
  const { showSidebar, handleShowSidebar } = useSetting();

  return (
    <div>
      <span data-testid="sidebar-status">
        {showSidebar ? "open" : "closed"}
      </span>

      <button onClick={() => handleShowSidebar(true)}>
        open
      </button>
    </div>
  );
};


describe("SettingContext", () => {
  test("default showSidebar is false", () => {
    render(
      <SettingProvider>
        <TestConsumer />
      </SettingProvider>
    );

    expect(screen.getByTestId("sidebar-status").textContent).toBe("closed");
  });

  test("handleShowSidebar updates state", async () => {
    const user = userEvent.setup();

    render(
      <SettingProvider>
        <TestConsumer />
      </SettingProvider>
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("sidebar-status").textContent).toBe("open");
  });
});