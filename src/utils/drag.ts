import type { Point } from "../types";

export function useDrag(callback: (arg: { base: Point; p: Point }) => void) {
  let dragging = false;
  let base: Point | null = null;
  let current: Point | null = null;

  const onDown = (e: MouseEvent) => {
    dragging = true;
    base = { x: e.pageX, y: e.pageY };
    current = { x: e.pageX, y: e.pageY };
  };
  const onMove = (e: MouseEvent) => {
    current = { x: e.pageX, y: e.pageY };
    if (dragging) {
      callback({ base, p: { ...current } });
    }
  };
  const onUp = () => {
    if (dragging) {
      callback({ base, p: { ...current } });
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
