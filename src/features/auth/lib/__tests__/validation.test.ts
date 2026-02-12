import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../validation";

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "user@kpi.ua",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@kpi.ua",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid register data", () => {
    const result = registerSchema.safeParse({
      email: "user@kpi.ua",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      email: "user@kpi.ua",
      password: "short",
      firstName: "Test",
      lastName: "User",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty firstName", () => {
    const result = registerSchema.safeParse({
      email: "user@kpi.ua",
      password: "password123",
      firstName: "",
      lastName: "User",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty lastName", () => {
    const result = registerSchema.safeParse({
      email: "user@kpi.ua",
      password: "password123",
      firstName: "Test",
      lastName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "bad-email",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 8 character password", () => {
    const result = registerSchema.safeParse({
      email: "user@kpi.ua",
      password: "12345678",
      firstName: "Test",
      lastName: "User",
    });
    expect(result.success).toBe(true);
  });
});
