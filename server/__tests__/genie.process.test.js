const { describe, it, expect, vi } = require("vitest");
const genieService = require("../genieService");
const sampleService = require("../sampleService");
const demoService = require("../demoService");

describe("genieService.process", () => {
  it("routes basic mode to sampleService.handle", async () => {
    const fake = {
      out_envelope: { pages: [], metadata: {}, actions: {} },
      metadata: { generatedAt: new Date().toISOString() },
    };
    const spy = vi.spyOn(sampleService, "handle").mockResolvedValue(fake);
    await genieService.process({ mode: "basic", prompt: "Test prompt" });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ prompt: "Test prompt" })
    );
    spy.mockRestore();
  });

  it("routes demo mode to demoService.handle", async () => {
    const fake = {
      out_envelope: { pages: [], metadata: {}, actions: {} },
      metadata: { model: "demo-1", pages: 0 },
    };
    const spy = vi.spyOn(demoService, "handle").mockResolvedValue(fake);
    await genieService.process({ mode: "demo", prompt: "Demo prompt" });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ prompt: "Demo prompt" })
    );
    spy.mockRestore();
  });
});
