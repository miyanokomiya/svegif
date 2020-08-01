import { writable, derived } from "svelte/store";
import type { Scene, Canvas } from "../types";

function createCanvas() {
  const canvas = writable<Canvas>({
    scenes: [],
    timeline: 0,
  });
  return {
    ...canvas,
    pushScene: (scene: Scene) =>
      canvas.update(($canvas) => {
        $canvas.scenes = [...$canvas.scenes, scene];
        return $canvas;
      }),
  };
}
export const canvas = createCanvas();

export const currentScene = derived(canvas, ($canvas) =>
  $canvas.scenes.find(
    (s) => s.from <= $canvas.timeline && $canvas.timeline < s.to
  )
);
