<script lang="ts">
  import type { Point, Layer } from '../types';
  import {
    canvas,
    setTimeline,
    patchScene,
    patchLayer,
    sortLayer,
    totalTime,
  } from '../stores/canvas';
  import { useDrag } from '../utils/drag';
  import TicMark from './TicMark.svelte';
  import TimelineLayer from './TimelineLayer.svelte';

  const RANGE_PX_SCALE = 0.1;

  let layerWrapper: HTMLElement;
  let dragType: '' | 'timeline' | 'range' | 'sort' | 'move' = '';
  let draggingTargetIndex = -1;
  let rangeDraggingOrigin = 0;
  let draggingLayerOrigin: { from: number; range: number } | null = null;
  let sortPoint: Point | null = null;

  function getLayerStyle(layer: Layer): string {
    return `width: ${layer.range * RANGE_PX_SCALE}px;  left: ${
      layer.from * RANGE_PX_SCALE
    }px;`;
  }

  function moveTimeline(x: number) {
    const rect = layerWrapper.getBoundingClientRect();
    const rate = (x - rect.left) / ($totalTime * RANGE_PX_SCALE);
    setTimeline(Math.min(Math.max(rate, 0), 1) * $totalTime);
  }

  const moveRange = (arg: { base: Point; p: Point }) => {
    const range = rangeDraggingOrigin + (arg.p.x - arg.base.x) / RANGE_PX_SCALE;
    if (range < 1) return;
    patchScene(draggingTargetIndex, { range });
  };

  const canvasDrag = useDrag((arg) => {
    switch (dragType) {
      case 'timeline':
        moveTimeline(arg.p.x);
        break;
      case 'range':
        moveRange(arg);
        break;
      case 'sort':
        const rect = layerWrapper.getBoundingClientRect();
        sortPoint = { x: arg.p.x - rect.left, y: arg.p.y - rect.top };
        break;
      case 'move':
        patchLayer(draggingTargetIndex, {
          from: Math.max(
            draggingLayerOrigin.from + (arg.p.x - arg.base.x) / RANGE_PX_SCALE,
            0
          ),
        });
        break;
    }
  });

  const onDownTimeline = (e: MouseEvent) => {
    dragType = 'timeline';
    canvasDrag.onDown(e);
  };
  const onDownRange = (index: number, e: MouseEvent) => {
    dragType = 'range';
    draggingTargetIndex = index;
    rangeDraggingOrigin = $canvas.scenes[index].range;
    canvasDrag.onDown(e);
  };
  const onDownSort = (index: number, e: MouseEvent) => {
    dragType = 'sort';
    draggingTargetIndex = index;
    canvasDrag.onDown(e);
  };
  const onDownMove = (index: number, e: MouseEvent) => {
    dragType = 'move';
    draggingTargetIndex = index;
    draggingLayerOrigin = {
      from: $canvas.layers[index].from,
      range: $canvas.layers[index].range,
    };
    canvasDrag.onDown(e);
  };
  const onUp = () => {
    canvasDrag.onUp();
    switch (dragType) {
      case 'sort':
        sortLayer(draggingTargetIndex, getNearestGapLayerIndex(sortPoint));
        break;
    }
    dragType = '';
    draggingTargetIndex = -1;
    draggingLayerOrigin = null;
    rangeDraggingOrigin = 0;
    sortPoint = null;
  };

  function getNearestGapLayerIndex(p: Point): number {
    if (!layerWrapper) return 0;

    let top = 0;
    let to = 0;
    [...layerWrapper.childNodes].some((e: Element, i) => {
      const rect = e.getBoundingClientRect();
      if (p.y < top + rect.height / 2) {
        return true;
      } else {
        top = top + rect.height;
        to = i + 1;
        return false;
      }
    });
    return to;
  }

  function getNearestGapLayerTop(p: Point): number {
    if (!layerWrapper) return 0;
    const index = getNearestGapLayerIndex(p);
    if ($canvas.layers.length <= index) {
      return [...layerWrapper.childNodes].reduce(
        (top, e: Element) => top + e.getBoundingClientRect().height,
        0
      );
    } else {
      const el = layerWrapper.childNodes[index] as Element;
      return (
        el.getBoundingClientRect().top -
        layerWrapper.getBoundingClientRect().top
      );
    }
  }

  $: timelineLeftPx = $canvas.timeline * RANGE_PX_SCALE;
  $: sortLineTopPx = sortPoint ? getNearestGapLayerTop(sortPoint) : 0;
</script>

<svelte:window
  on:mousemove="{canvasDrag.onMove}"
  on:mouseup="{onUp}"
  on:mouseleave="{onUp}"
/>
<div class="root">
  <div class="timeline-wrapper" on:mousedown|preventDefault="{onDownTimeline}">
    <div class="timeline-content">
      <ul class="layers" bind:this="{layerWrapper}">
        {#each $canvas.layers as layer, i (layer.key)}
          <li>
            {#if i % 2 === 0}
              <TicMark
                rangePxScale="{RANGE_PX_SCALE}"
                totalTime="{$totalTime}"
              />
            {/if}
            <div style="{getLayerStyle(layer)}">
              <TimelineLayer
                {layer}
                on:mouseDownSort="{({ detail }) => onDownSort(i, detail)}"
                on:mouseDownMove="{({ detail }) => onDownMove(i, detail)}"
              />
            </div>
          </li>
        {/each}
      </ul>
      <div class="line" style="{`left: ${timelineLeftPx}px;`}">
        <div></div>
      </div>
    </div>
    {#if sortPoint}
      <div
        class="sort-dummy"
        style="{getLayerStyle($canvas.layers[draggingTargetIndex]) + `top: ${sortPoint.y}px;`}"
      >
        <TimelineLayer layer="{$canvas.layers[draggingTargetIndex]}" />
      </div>
      <div class="sort-line" style="{`top: ${sortLineTopPx}px;`}"></div>
    {/if}
  </div>
</div>

<style lang="scss">
  .root {
    background-color: #aaa;
  }
  .timeline-wrapper {
    display: flex;
    border: 1px solid #000;
    overflow: auto;
    position: relative;
    padding: 0 30px;
    overscroll-behavior: none;
  }
  .timeline-content {
    position: relative;
    display: inline-flex;
    flex-direction: column;

    .layers {
      list-style: none;

      > li {
        width: 100%;
        border: solid 1px #000;

        > div {
          position: relative;
        }
      }
    }
  }
  .line {
    position: absolute;
    top: 0;
    width: 13px;
    height: 100%;
    padding: 0 5px;
    transform: translateX(calc(-50%));
    border-top: 3px solid red;
    border-bottom: 3px solid red;
    pointer-events: none;

    > div {
      width: 100%;
      height: 100%;
      background-color: red;
    }
  }
  .sort-dummy {
    position: absolute;
    transform: translateY(-8px);
    opacity: 0.6;
    pointer-events: none;
    border: solid 1px #000;
  }
  .sort-line {
    position: absolute;
    left: 0;
    width: 100%;
    height: 5px;
    transform: translateY(-50%);
    background-color: blue;
    pointer-events: none;
  }
</style>
