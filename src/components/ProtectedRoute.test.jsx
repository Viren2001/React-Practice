import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

const mockUseAuth = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="redirect">Redirect:{to}</div>
  };
});

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
    mockUseAuth.mockReturnValue({ currentUser: null });

    render(
      <ProtectedRoute>
        <div>Private content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("redirect")).toHaveTextContent("Redirect:/login");
    expect(screen.queryByText("Private content")).not.toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: "user-1" } });

    render(
      <ProtectedRoute>
        <div>Private content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Private content")).toBeInTheDocument();
  });
});
