import { writable, derived } from "svelte/store";
import type { Scene, Layer, Canvas } from "../types";
import { getLayer } from "../utils/layer";

export const canvas = writable<Canvas>({
  scenes: [],
  layers: [getLayer({ from: 0, range: 1000 })],
  timeline: 0,
  viewBox: { x: 0, y: 0, width: 400, height: 400 },
});

export function pushLayer(layer: Layer): void {
  canvas.update(($canvas) => {
    $canvas.layers = [...$canvas.layers, layer];
    return $canvas;
  });
}

export function setTimeline(val: number): void {
  canvas.update(($canvas) => {
    $canvas.timeline = val;
    return $canvas;
  });
}

export function sortLayer(from: number, to: number): void {
  if (from === to) return;
  canvas.update(($canvas) => {
    $canvas.layers.splice(to, 0, $canvas.layers[from]);
    if (from < to) {
      $canvas.layers.splice(from, 1);
    } else {
      $canvas.layers.splice(from + 1, 1);
    }
    return $canvas;
  });
}

export function patchScene(index: number, val: Partial<Scene>): void {
  canvas.update(($canvas) => {
    $canvas.scenes[index] = { ...$canvas.scenes[index], ...val };
    return $canvas;
  });
}

export const currentScene = derived(canvas, ($canvas) => {
  return {
    image: "",
    layers: getLayersAtTime($canvas.layers, $canvas.timeline),
  };
});

export function getLayersAtTime(layers: Layer[], time: number) {
  return layers.filter((l) => {
    return l.from <= time && time < l.from + l.range;
  });
}

export const totalTime = derived(canvas, ($canvas) => {
  return $canvas.layers
    .map((l) => l.from + l.range)
    .reduce((a, b) => Math.max(a, b), 0);
});

export function getSumOfTime(scenes: Scene[]): number {
  return scenes.reduce((total, s) => {
    return total + s.range;
  }, 0);
}

export function getNearestSceneIndexAtTime(
  scenes: Scene[],
  time: number
): number {
  let index = 0;
  let currentTime = 0;
  scenes.some((s, i) => {
    if (time < currentTime + s.range / 2) {
      index = i;
    } else {
      index = i + 1;
    }
    currentTime = currentTime + s.range;
    return time <= currentTime;
  });
  return index;
}
