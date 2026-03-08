"use client";

import { useEffect, useState, useCallback } from "react";

interface ConnectionLinesProps {
  /** Map of source element IDs to target element IDs */
  connections: { sourceId: string; targetId: string }[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  color?: string;
}

interface Point {
  x: number;
  y: number;
}

export function ConnectionLines({
  connections,
  containerRef,
  color = "rgba(59, 130, 246, 0.3)",
}: ConnectionLinesProps) {
  const [lines, setLines] = useState<{ from: Point; to: Point }[]>([]);

  const computeLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines: { from: Point; to: Point }[] = [];
    for (const { sourceId, targetId } of connections) {
      const sourceEl = document.getElementById(sourceId);
      const targetEl = document.getElementById(targetId);
      if (!sourceEl || !targetEl) continue;

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      newLines.push({
        from: {
          x: sourceRect.right - containerRect.left,
          y: sourceRect.top + sourceRect.height / 2 - containerRect.top,
        },
        to: {
          x: targetRect.left - containerRect.left,
          y: targetRect.top + targetRect.height / 2 - containerRect.top,
        },
      });
    }
    setLines(newLines);
  }, [connections, containerRef]);

  useEffect(() => {
    computeLines();
    // Recompute on scroll/resize
    const container = containerRef.current;
    if (!container) return;

    const scrollables = container.querySelectorAll("[data-scroll-area]");
    const handler = () => requestAnimationFrame(computeLines);
    scrollables.forEach((el) => el.addEventListener("scroll", handler));
    window.addEventListener("resize", handler);

    return () => {
      scrollables.forEach((el) => el.removeEventListener("scroll", handler));
      window.removeEventListener("resize", handler);
    };
  }, [computeLines, containerRef]);

  if (lines.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {lines.map((line, i) => {
        const midX = (line.from.x + line.to.x) / 2;
        return (
          <path
            key={i}
            d={`M ${line.from.x} ${line.from.y} C ${midX} ${line.from.y}, ${midX} ${line.to.y}, ${line.to.x} ${line.to.y}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}
