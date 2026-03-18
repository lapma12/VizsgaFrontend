import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Scoreboard from "../Pages/ScoreBoardPage";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/scoreboard" }),
  };
});

vi.mock("react-spinners/ClipLoader", () => ({
  default: () => <div>Loading...</div>,
}));

describe("Ranglista oldal tesztelése", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ranglista oldal megnyitásakor a játékosok pontszámai megjelennek", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        result: [
          { id: 1, name: "Admin", totalScore: 7750, totalKills: 406, profilePictureUrl: "/avatar1.png", },
          { id: 2, name: "Dongesz", totalScore: 625, totalKills: 61, profilePictureUrl: "/avatar2.png", },
        ],
      },
    });
    render(
      <MemoryRouter>
        <Scoreboard />
      </MemoryRouter>
    );
    expect(await screen.findByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("7750")).toBeInTheDocument();
    expect(await screen.findByText("Dongesz")).toBeInTheDocument();
    expect(screen.getByText("625")).toBeInTheDocument();
  });
});