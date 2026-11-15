import { getErrorMessage } from "@/lib/errors";

describe("getErrorMessage", () => {
  it("returns an error message or a fallback for unknown values", () => {
    expect(getErrorMessage(new Error("request failed"), "fallback")).toBe("request failed");
    expect(getErrorMessage({ message: "database failed" }, "fallback")).toBe("database failed");
    expect(getErrorMessage({}, "fallback")).toBe("fallback");
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });
});
