import { v4 as uuidv4 } from 'uuid';
import type { Layer, RectElement, ImageElement } from '../types';

export function getLayer(arg: Partial<Layer> = {}): Layer {
  return {
    key: uuidv4(),
    from: 0,
    range: 0,
    elements: [],
    ...arg,
  };
}

export function getRectElement(arg: Partial<RectElement> = {}): RectElement {
  return {
    type: 'rect',
    key: uuidv4(),
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    ...arg,
  };
}

export function getImageElement(arg: Partial<ImageElement> = {}): ImageElement {
  return {
    ...getRectElement(arg),
    type: 'image',
    base64: '',
    ...arg,
  };
}

export function moveAll(
  origin: { from: number },
  diff: number
): { from: number } {
  return {
    from: Math.max(origin.from + diff, 0),
  };
}

export function moveLeft(
  origin: { from: number; range: number },
  diff: number
): { from: number; range: number } {
  const layer = {
    from: origin.from + diff,
    range: origin.range - diff,
  };
  if (layer.from < 0) {
    return {
      from: 0,
      range: layer.range + layer.from,
    };
  } else if (layer.range < 0) {
    return {
      from: origin.from + origin.range,
      range: 0,
    };
  } else {
    return layer;
  }
}

export function moveRight(
  origin: { range: number },
  diff: number
): { range: number } {
  return {
    range: Math.max(origin.range + diff, 0),
  };
}
