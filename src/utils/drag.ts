import throttle from 'just-throttle';
import type { Point } from '../types';

const THROTTLE = 1000 / 60;

export function useDrag(
  dragCallback: (arg: { base: Point; p: Point; d: Point }) => void,
  clickCallback: (arg: Point) => void = () => {}
) {
  let dragging = false;
  let base: Point | null = null;
  let past: Point | null = null;
  let current: Point | null = null;
  let downAt = 0;

  const onDown = (e: MouseEvent) => {
    dragging = true;
    base = { x: e.pageX, y: e.pageY };
    current = { x: e.pageX, y: e.pageY };
    downAt = Date.now();
  };

  const throttleedCallback = throttle(
    () => {
      if (!dragging) return;

      if (past) {
        dragCallback({
          base,
          p: { ...current },
          d: { x: current.x - past.x, y: current.y - past.y },
        });
      }
      past = current ? { ...current } : null;
    },
    THROTTLE,
    true
  );

  const onMove = (e: MouseEvent) => {
    if (!dragging) return;

    current = { x: e.pageX, y: e.pageY };
    throttleedCallback();
  };

  const onUp = () => {
    if (Date.now() - downAt < 100) {
      clickCallback({ ...current });
    } else if (dragging) {
      dragCallback({ base, p: { ...current }, d: { x: 0, y: 0 } });
    }
    dragging = false;
    base = null;
    current = null;
    past = null;
    downAt = 0;
  };
  return {
    onDown,
    onMove,
    onUp,
  };
}
