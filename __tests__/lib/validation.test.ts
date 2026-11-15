import {
  isNonEmptyString,
  isOptionalString,
  isRecord,
  readJsonObject,
} from "@/lib/validation";

describe("request validation", () => {
  it("accepts JSON objects and rejects null, arrays, and primitives", () => {
    expect(isRecord({ value: true })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord("value")).toBe(false);
  });

  it("distinguishes required non-empty strings from optional strings", () => {
    expect(isNonEmptyString("  valid  ")).toBe(true);
    expect(isNonEmptyString("  ")).toBe(false);
    expect(isNonEmptyString(12)).toBe(false);
    expect(isOptionalString(undefined)).toBe(true);
    expect(isOptionalString(null)).toBe(true);
    expect(isOptionalString("valid")).toBe(true);
    expect(isOptionalString(false)).toBe(false);
  });

  it("returns a JSON object for valid request bodies and null for invalid ones", async () => {
    const validRequest = { json: async () => ({ value: "valid" }) };
    const invalidRequest = { json: async () => [1, 2] };
    const malformedRequest = { json: async () => Promise.reject(new Error("invalid JSON")) };

    await expect(readJsonObject(validRequest)).resolves.toEqual({ value: "valid" });
    await expect(readJsonObject(invalidRequest)).resolves.toBeNull();
    await expect(readJsonObject(malformedRequest)).resolves.toBeNull();
  });
});
