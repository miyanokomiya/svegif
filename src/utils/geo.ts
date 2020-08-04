import type { Rect } from '../types';

export function resizeByLeft(origin: Rect, diffX: number): Partial<Rect> {
  const x = origin.x + diffX;
  const width = origin.width - diffX;
  return {
    x: Math.min(x, x + width),
    width: Math.abs(width),
  };
}

export function resizeByRight(origin: Rect, diffX: number): Partial<Rect> {
  const width = origin.width + diffX;
  return {
    x: Math.min(origin.x, origin.x + width),
    width: Math.abs(width),
  };
}

export function resizeByTop(origin: Rect, diffY: number): Partial<Rect> {
  const y = origin.y + diffY;
  const height = origin.height - diffY;
  return {
    y: Math.min(y, y + height),
    height: Math.abs(height),
  };
}

export function resizeByBottom(origin: Rect, diffY: number): Partial<Rect> {
  const height = origin.height + diffY;
  return {
    y: Math.min(origin.y, origin.y + height),
    height: Math.abs(height),
  };
}
