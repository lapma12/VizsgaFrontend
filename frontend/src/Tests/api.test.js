import { describe, test, expect, beforeEach } from "vitest";
import api from "../api/api";

describe("Token kezelés tesztelése", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("sikeres bejelentkezés után a token bekerül az Authorization headerbe", async () => {
    localStorage.setItem("authToken", "fake-token-123");

    const interceptor = api.interceptors.request.handlers[0].fulfilled;

    const config = {
      headers: {},
    };

    const updatedConfig = await interceptor(config);

    expect(localStorage.getItem("authToken")).toBe("fake-token-123");
    expect(updatedConfig.headers.Authorization).toBe("Bearer fake-token-123");
  });
});