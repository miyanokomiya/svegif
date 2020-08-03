export interface TimelineEntity {
  range: number;
}

export interface Scene extends TimelineEntity {
  image: ImageData;
  layers: Layer[];
}

export interface ImageData {
  base64: string;
  width: number;
  height: number;
}

export interface Layer extends TimelineEntity {
  key: string;
  from: number;
  elements: BaseElement[];
}

export interface BaseElement {
  readonly type: "rect" | "image";
  key: string;
}

export interface RectElement extends BaseElement, Rect {}

export interface ImageElement extends RectElement {
  base64: string;
}

export interface Canvas {
  scenes: Scene[];
  layers: Layer[];
  timeline: number;
  viewBox: Rect;
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
