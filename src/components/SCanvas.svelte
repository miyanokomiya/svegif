<script lang="ts">
  import { currentScene } from "../stores/canvas";
  import { useDrag } from "../utils/drag";

  export let width = 100;
  export let height = 100;
  let scale = 1;
  let base = { x: 0, y: 0 };
  let dragType: "" | "scroll" | "zoom" = "";
  let scaleSlider: HTMLElement | null;

  const SCALE_BETA = 1.1;
  const SCALE_RANGE = 20;
  const SCALE_MAX = Math.pow(1.1, SCALE_RANGE / 2);
  const SCALE_MIN = Math.pow(1.1, -SCALE_RANGE / 2);
  $: scaleRate = Math.log(scale) / Math.log(SCALE_BETA);
  $: scaleAnchorTop = `${(scaleRate / SCALE_RANGE + 1 / 2) * 100}%`;

  function getCenter() {
    return {
      x: base.x + (width / 2) * scale,
      y: base.y + (height / 2) * scale,
    };
  }

  function recalcZoom(pageY: number) {
    const rect = scaleSlider.getBoundingClientRect();
    const rate = (pageY - rect.top) / rect.height;
    const oldCenter = getCenter();
    scale = Math.max(
      Math.min(Math.pow(SCALE_BETA, SCALE_RANGE * (rate - 0.5)), SCALE_MAX),
      SCALE_MIN
    );
    const newCenter = getCenter();
    base = {
      x: base.x - (newCenter.x - oldCenter.x),
      y: base.y - (newCenter.y - oldCenter.y),
    };
  }

  const canvasDrag = useDrag((arg) => {
    switch (dragType) {
      case "scroll":
        base = { x: base.x - arg.d.x * scale, y: base.y - arg.d.y * scale };
        break;
      case "zoom":
        recalcZoom(arg.p.y);
        break;
    }
  });
  const onDownCanvas = (e: MouseEvent) => {
    canvasDrag.onDown(e);
    dragType = "scroll";
  };
  const onDownZoom = (e: MouseEvent) => {
    canvasDrag.onDown(e);
    dragType = "zoom";
    recalcZoom(e.pageY);
  };
  const onUp = () => {
    dragType = "";
    canvasDrag.onUp();
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
    {#if $currentScene.image}
      <image
        x="imageRect.x"
        y="imageRect.y"
        width="{$currentScene.image.width}"
        height="{$currentScene.image.height}"
        xlink:href="{$currentScene.image.base64}"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      ></image>
    {/if}
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
