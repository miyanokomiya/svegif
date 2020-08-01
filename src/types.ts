export interface TimelineEntity {
  range: number;
}

export interface Scene extends TimelineEntity {
  image: ImageData;
}

export interface ImageData {
  base64: string;
  width: number;
  height: number;
}

export interface Canvas {
  scenes: Scene[];
  timeline: number;
}

export interface Point {
  x: number;
  y: number;
}
