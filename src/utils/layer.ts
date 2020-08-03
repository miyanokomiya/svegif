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
