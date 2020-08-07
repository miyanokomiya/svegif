import { writable, derived } from 'svelte/store';
import type {
  Layers,
  Layer,
  Elements,
  BaseElement,
  Canvas,
  Rect,
} from '../types';

export const _canvas = writable<Canvas>({
  layerKeys: [],
  timeline: 0,
  viewBox: { x: 0, y: 0, width: 400, height: 400 },
});
export const _layers = writable<Layers>({});
export const _elements = writable<Elements>({});

export const canvas = {
  ..._canvas,
  setTimeline(val: number) {
    _canvas.update(($canvas) => {
      $canvas.timeline = val;
      return $canvas;
    });
  },
  setViewBox(val: Rect) {
    _canvas.update(($canvas) => {
      $canvas.viewBox = val;
      return $canvas;
    });
  },
  pushLayer(layer: Layer) {
    _canvas.update(($canvas) => {
      $canvas.layerKeys.push(layer.key);
      return $canvas;
    });
    _layers.update(($layers) => {
      $layers[layer.key] = layer;
      return $layers;
    });
  },
  pushElement(layerKey: string, element: BaseElement) {
    _layers.update(($layers) => {
      $layers[layerKey].elementKeys.push(element.key);
      return $layers;
    });
    _elements.update(($elements) => {
      $elements[element.key] = element;
      return $elements;
    });
  },
  sortLayer(from: number, to: number) {
    if (from === to) return;
    _canvas.update(($canvas) => {
      $canvas.layerKeys.splice(to, 0, $canvas.layerKeys[from]);
      if (from < to) {
        $canvas.layerKeys.splice(from, 1);
      } else {
        $canvas.layerKeys.splice(from + 1, 1);
      }
      return $canvas;
    });
  },
  patchLayer(val: Partial<Layer> & { key: string }) {
    _layers.update(($layers) => {
      $layers[val.key] = { ...$layers[val.key], ...val };
      return $layers;
    });
  },
  patchElement(val: Partial<BaseElement> & { key: string }) {
    _elements.update(($elements) => {
      $elements[val.key] = { ...$elements[val.key], ...val };
      return $elements;
    });
  },
};
export const layers = _layers;
export const elements = _elements;

export const currentScene = derived(
  [_canvas, _layers],
  ([$canvas, $layers]) => {
    return {
      layers: getLayersAtTime($layers, $canvas.layerKeys, $canvas.timeline),
    };
  }
);

export function getLayersAtTime(layers: Layers, keys: string[], time: number) {
  return keys
    .map((key) => layers[key])
    .filter((l) => {
      return l && l.from <= time && time < l.from + l.range;
    });
}

export const totalTime = derived(_layers, ($layers) => {
  return Object.values($layers)
    .map((l) => l.from + l.range)
    .reduce((a, b) => Math.max(a, b), 0);
});
