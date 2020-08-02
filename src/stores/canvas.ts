import { writable, derived } from "svelte/store";
import type { Scene, Layer, Canvas } from "../types";

export const canvas = writable<Canvas>({
  scenes: [],
  layers: [],
  timeline: 0,
});

export function pushScene(scene: Scene): void {
  canvas.update(($canvas) => {
    $canvas.scenes = [...$canvas.scenes, scene];
    return $canvas;
  });
}

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

export function moveScene(from: number, to: number): void {
  if (from === to) return;
  canvas.update(($canvas) => {
    $canvas.scenes.splice(to, 0, $canvas.scenes[from]);
    if (from < to) {
      $canvas.scenes.splice(from, 1);
    } else {
      $canvas.scenes.splice(from + 1, 1);
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
  return getSceneAtTime($canvas.scenes, $canvas.timeline);
});

export function getSceneAtTime(scenes: Scene[], time: number) {
  let current = 0;
  return scenes.find((s) => {
    current = current + s.range;
    return time < current;
  });
}

export const totalTime = derived(canvas, ($canvas) => {
  return getSumOfTime($canvas.scenes);
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
