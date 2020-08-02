import type { Point } from "../types";

export function useDrag(
  callback: (arg: { base: Point; p: Point; d: Point }) => void
) {
  let dragging = false;
  let base: Point | null = null;
  let current: Point | null = null;

  const onDown = (e: MouseEvent) => {
    dragging = true;
    base = { x: e.pageX, y: e.pageY };
    current = { x: e.pageX, y: e.pageY };
  };
  const onMove = (e: MouseEvent) => {
    const past = current ? { ...current } : null;
    current = { x: e.pageX, y: e.pageY };
    if (dragging && past) {
      callback({
        base,
        p: { ...current },
        d: { x: current.x - past.x, y: current.y - past.y },
      });
    }
  };
  const onUp = () => {
    if (dragging) {
      const p = { ...current };
      const d = { x: p.x - current.x, y: p.y - current.y };
      callback({ base, p, d });
    }
    dragging = false;
    base = null;
    current = null;
  };
  return {
    onDown,
    onMove,
    onUp,
  };
}
