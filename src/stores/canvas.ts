import { writable, derived } from "svelte/store";
import type { Scene, Canvas } from "../types";

export const canvas = writable<Canvas>({
  scenes: [],
  timeline: 0,
});

export function pushScene(scene: Scene): void {
  canvas.update(($canvas) => {
    $canvas.scenes = [...$canvas.scenes, scene];
    return $canvas;
  });
}

export function setTimeline(val: number): void {
  canvas.update(($canvas) => {
    $canvas.timeline = val;
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
  let current = 0;
  return $canvas.scenes.find((s) => {
    current = current + s.range;
    return $canvas.timeline < current;
  });
});

export const totalTime = derived(canvas, ($canvas) => {
  return $canvas.scenes.reduce((total, s) => {
    return total + s.range;
  }, 0);
});
