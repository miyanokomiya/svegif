export interface TimelineEntity {
  range: number;
}

export interface Scene extends TimelineEntity {
  layers: Layer[];
}

export interface ImageData {
  base64: string;
  width: number;
  height: number;
}

export interface Canvas {
  layerKeys: string[];
  timeline: number;
  viewBox: Rect;
}

export interface Layer extends TimelineEntity {
  key: string;
  from: number;
  elementKeys: string[];
}

export interface BaseElement {
  readonly type: 'rect' | 'image';
  key: string;
}

export interface RectElement extends BaseElement, Rect {}

export interface ImageElement extends RectElement {
  base64: string;
}

export interface Layers {
  [key: string]: Layer;
}

export interface Elements {
  [key: string]: BaseElement;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point {
  width: number;
  height: number;
}

export interface CanvasView {
  scale: number;
  base: Point;
  width: number;
  height: number;
}
