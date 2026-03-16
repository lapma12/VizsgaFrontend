import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import AuthPage from "../Pages/AuthPage";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/login" }),
  };
});

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({ role: "User" })),
}));

vi.mock("../Components/Toast", () => ({
  default: ({ message }) => (message ? <div>{message}</div> : null),
}));

vi.mock("../Components/PasswordInput", () => ({
  default: ({ value, onChange }) => (
    <input
      type="password"
      placeholder="Jelszó"
      value={value}
      onChange={onChange}
    />
  ),
}));

describe("Bejelentkezési felület tesztelése", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("helyes adatok megadása esetén a felhasználó sikeresen bejelentkezik", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, token: "fake-token", },
    });
    render(
      <MemoryRouter>
        <AuthPage setshowAdminPanel={vi.fn()} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Username or Email"), {
      target: { value: "validuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Login" })[1]);
    expect(await screen.findByText("Successfully login!")).toBeInTheDocument();
  });

  test("helytelen adatok megadása esetén hibaüzenet jelenik meg", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
      },
    });

    render(
      <MemoryRouter>
        <AuthPage setshowAdminPanel={vi.fn()} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username or Email"), {
      target: { value: "invalid@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getAllByRole("button", { name: "Login" })[1]);

    expect(
      await screen.findByText("Invalid username or password")
    ).toBeInTheDocument();
  });
});