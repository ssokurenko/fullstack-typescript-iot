import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 800;

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

/**
 * Smoothly counts from the previously displayed value to `target` instead of
 * snapping, so metric cards visibly count up/down on each new reading.
 */
export function useAnimatedNumber(
  target: number | undefined,
  durationMs: number = DEFAULT_DURATION_MS,
): number | undefined {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    if (target === undefined) return;

    const from = displayRef.current;
    // No prior value to animate from (this card's first-ever reading) - snap
    // straight to it instead of leaving `display` stuck at its initial
    // `undefined` state (setState never fired, so it would never appear).
    if (from === undefined || from === target) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }

    let frameId: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const current = from + (target - from) * easeOutCubic(progress);
      displayRef.current = current;
      setDisplay(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return target === undefined ? undefined : display;
}
