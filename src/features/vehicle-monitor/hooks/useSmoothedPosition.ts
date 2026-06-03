import { useEffect, useRef, useState } from "react";

import type { TraccarPosition } from "../../../api/traccar.api";

const ANIMATION_DURATION = 900;

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function useSmoothedPosition(position: TraccarPosition | null) {
  const [smoothedPosition, setSmoothedPosition] =
    useState<TraccarPosition | null>(position);

  const previousPositionRef = useRef<TraccarPosition | null>(position);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    if (!position) {
      previousPositionRef.current = null;
      queueMicrotask(() => setSmoothedPosition(null));
      return;
    }

    const previousPosition = previousPositionRef.current;

    if (!previousPosition) {
      previousPositionRef.current = position;
      queueMicrotask(() => setSmoothedPosition(position));
      return;
    }

    const startedAt = performance.now();

    // Interpolate GPS updates so the marker glides instead of jumping.
    const animate = () => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      setSmoothedPosition({
        ...position,
        latitude: lerp(previousPosition.latitude, position.latitude, progress),
        longitude: lerp(
          previousPosition.longitude,
          position.longitude,
          progress,
        ),
      });

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      previousPositionRef.current = position;
      frameRef.current = null;
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [position]);

  return smoothedPosition;
}
