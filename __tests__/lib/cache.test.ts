import { getOrSetCache, invalidateCache } from "@/lib/cache";

describe("cache", () => {
  beforeEach(() => {
    invalidateCache();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("computes cold values and reuses them before their TTL expires", async () => {
    const fetcher = jest.fn().mockResolvedValue({ value: "cached" });

    await expect(getOrSetCache("test:key", fetcher, 60)).resolves.toEqual({
      value: "cached",
    });
    await expect(getOrSetCache("test:key", fetcher, 60)).resolves.toEqual({
      value: "cached",
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns stale data while refreshing it in the background", async () => {
    let now = 1_000;
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const fetcher = jest
      .fn()
      .mockResolvedValueOnce("stale")
      .mockResolvedValueOnce("fresh");

    await expect(getOrSetCache("test:stale", fetcher, 1)).resolves.toBe("stale");

    now += 1_001;
    await expect(getOrSetCache("test:stale", fetcher, 1)).resolves.toBe("stale");
    await Promise.resolve();

    await expect(getOrSetCache("test:stale", fetcher, 1)).resolves.toBe("fresh");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("invalidates only keys matching a prefix", async () => {
    const fetcher = jest.fn(async (value: string) => value);

    await getOrSetCache("doctors:list", () => fetcher("list"));
    await getOrSetCache("doctor:one", () => fetcher("one"));
    invalidateCache("doctors:");

    await getOrSetCache("doctors:list", () => fetcher("list"));
    await getOrSetCache("doctor:one", () => fetcher("one"));

    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("propagates cold-fetch failures without caching them", async () => {
    const error = new Error("fetch failed");
    const logError = jest.spyOn(console, "error").mockImplementation(() => {});
    const fetcher = jest.fn(() => Promise.reject<string>(error));

    await expect(getOrSetCache("test:error", fetcher)).rejects.toBe(error);
    await expect(getOrSetCache("test:error", fetcher)).rejects.toBe(error);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledTimes(2);
  });
});
