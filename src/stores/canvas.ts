import { writable } from 'svelte/store';
import type { Scene } from '../types'

function createScenes() {
  const scenes = writable<Scene[]>([]);
  return {
    ...scenes,
    push: (scene: Scene) => scenes.update(scenes => [...scenes, scene])
  }
}

export const scenes = createScenes()
