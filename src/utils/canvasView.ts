import type { Point, CanvasView } from "../types";

export const SCALE_BETA = 1.1;
export const SCALE_RANGE = 20;
const SCALE_MAX = Math.pow(1.1, SCALE_RANGE / 2);
const SCALE_MIN = Math.pow(1.1, -SCALE_RANGE / 2);

export function getCenter(cv: CanvasView) {
  return {
    x: cv.base.x + (cv.width / 2) * cv.scale,
    y: cv.base.y + (cv.height / 2) * cv.scale,
  };
}

export function getZoomInfo(
  cv: CanvasView,
  rate: number
): { scale: number; base: Point } {
  const oldCenter = getCenter(cv);
  const scale = Math.max(
    Math.min(Math.pow(SCALE_BETA, SCALE_RANGE * (rate - 0.5)), SCALE_MAX),
    SCALE_MIN
  );
  const newCenter = getCenter({ ...cv, scale });
  const base = {
    x: cv.base.x - (newCenter.x - oldCenter.x),
    y: cv.base.y - (newCenter.y - oldCenter.y),
  };
  return {
    scale,
    base,
  };
}
