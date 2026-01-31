import { describe, expect, it } from "vitest";

describe("Email Configuration", () => {
  it("should have ADMIN_EMAIL environment variable configured", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    expect(adminEmail).toBeDefined();
    expect(typeof adminEmail).toBe("string");
    expect(adminEmail?.length).toBeGreaterThan(0);
  });

  it("should have valid email format for ADMIN_EMAIL", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(adminEmail).toBeDefined();
    expect(emailRegex.test(adminEmail!)).toBe(true);
  });

  it("should be keyman2084@outlook.com", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    expect(adminEmail).toBe("keyman2084@outlook.com");
  });
});
