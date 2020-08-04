<script lang="ts">
  import type { Rect } from '../types';
  import { canvas, setViewBox, currentScene } from '../stores/canvas';
  import { useDrag } from '../utils/drag';
  import { SCALE_BETA, SCALE_RANGE, getZoomInfo } from '../utils/canvasView';
  import SElement from './elements/SElement.svelte';
  import SRectFrame from './frames/SRectFrame.svelte';

  export let width = 100;
  export let height = 100;
  let scale = 1;
  let base = { x: 0, y: 0 };
  let dragType: '' | 'scroll' | 'zoom' = '';
  let scaleSlider: HTMLElement | null;
  $: canvasView = {
    scale,
    base,
    width,
    height,
  };
  $: scaleRate = Math.log(scale) / Math.log(SCALE_BETA);
  $: scaleAnchorTop = `${(scaleRate / SCALE_RANGE + 1 / 2) * 100}%`;

  function recalcZoom(pageY: number) {
    const rect = scaleSlider.getBoundingClientRect();
    const rate = (pageY - rect.top) / rect.height;
    const next = getZoomInfo(canvasView, rate);
    scale = next.scale;
    base = next.base;
  }

  function resizeViewBox(rect: Rect) {
    setViewBox(rect);
  }

  const canvasDrag = useDrag((arg) => {
    switch (dragType) {
      case 'scroll':
        base = { x: base.x - arg.d.x * scale, y: base.y - arg.d.y * scale };
        break;
      case 'zoom':
        recalcZoom(arg.p.y);
        break;
    }
  });
  const onDownCanvas = (e: MouseEvent) => {
    canvasDrag.onDown(e);
    dragType = 'scroll';
  };
  const onDownZoom = (e: MouseEvent) => {
    canvasDrag.onDown(e);
    dragType = 'zoom';
    recalcZoom(e.pageY);
  };
  const onUp = () => {
    canvasDrag.onUp();
    dragType = '';
  };
</script>

<div
  class="root"
  on:mousedown|preventDefault="{onDownCanvas}"
  on:mousemove|preventDefault="{canvasDrag.onMove}"
  on:mouseup|preventDefault="{onUp}"
  on:mouseleave|preventDefault="{onUp}"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    font-family="sans-serif"
    viewBox="{`${base.x} ${base.y} ${width * scale} ${height * scale}`}"
    {width}
    {height}
  >
    {#each $currentScene.layers as layer (layer.key)}
      {#each layer.elements as element (element.key)}
        <SElement {element} />
      {/each}
    {/each}
    <SRectFrame
      {scale}
      rect="{$canvas.viewBox}"
      on:resize="{({ detail }) => resizeViewBox(detail)}"
    >
      <rect
        width="{$canvas.viewBox.width}"
        height="{$canvas.viewBox.height}"
        fill="none"
        stroke="red"
        stroke-width="2"
        stroke-dasharray="24 3 2 3 2 3"
      ></rect>
    </SRectFrame>
  </svg>
  <div bind:this="{scaleSlider}" class="scale-slider">
    <div
      class="bar"
      on:mousedown|preventDefault|stopPropagation="{onDownZoom}"
    ></div>
    <div
      class="anchor"
      style="{`top: ${scaleAnchorTop}`}"
      on:mousedown|preventDefault|stopPropagation="{onDownZoom}"
    ></div>
  </div>
</div>

<style lang="scss">
  .root {
    position: relative;
  }
  .scale-slider {
    position: absolute;
    bottom: 20px;
    right: 20px;
    height: 50%;
    text-align: center;

    .bar {
      position: absolute;
      transform: translateX(-50%);
      width: 8px;
      height: 100%;
      background-color: #fff;
      border-radius: 12px;
    }
    .anchor {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background-color: #888;
      border-radius: 50%;
      cursor: pointer;
    }
  }
</style>
