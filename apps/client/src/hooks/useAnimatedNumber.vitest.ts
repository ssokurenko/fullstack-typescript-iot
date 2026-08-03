import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAnimatedNumber } from "./useAnimatedNumber";

describe("useAnimatedNumber", () => {
  it("returns undefined while there is no value yet", () => {
    const { result } = renderHook(() => useAnimatedNumber(undefined));

    expect(result.current).toBeUndefined();
  });

  it("snaps immediately to the first value a card ever receives, without animating", () => {
    // Regression test: this used to get stuck at `undefined` forever because
    // the "skip animating the very first value" branch never called
    // setState, so the metric card would just show "—" forever.
    const { result, rerender } = renderHook(
      ({ value }: { value: number | undefined }) => useAnimatedNumber(value),
      { initialProps: { value: undefined as number | undefined } },
    );
    expect(result.current).toBeUndefined();

    act(() => {
      rerender({ value: 42 });
    });

    expect(result.current).toBe(42);
  });

  it("animates from the previous value toward a new target", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useAnimatedNumber(value),
      { initialProps: { value: 10 } },
    );
    expect(result.current).toBe(10);

    act(() => {
      rerender({ value: 100 });
    });

    await waitFor(() => expect(result.current).toBe(100), { timeout: 2000 });
  });
});
