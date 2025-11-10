import { describe, it, expect } from "vitest";
import * as sampleService from "../sampleService.js";

describe("sampleService.handle", () => {
  it("accepts payload and returns canonical out_envelope", async () => {
    const payload = { mode: "basic", prompt: "Hello world" };
    const res = await sampleService.handle(payload);
    expect(res).toBeDefined();
    expect(res.out_envelope).toBeDefined();
    expect(Array.isArray(res.out_envelope.pages)).toBe(true);
  });
});
