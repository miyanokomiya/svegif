export interface TimelineEntity {
  from: number;
  to: number;
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
