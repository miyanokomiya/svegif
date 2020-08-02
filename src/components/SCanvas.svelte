<script lang="ts">
  import { currentScene } from "../stores/canvas";
  import { useDrag } from "../utils/drag";

  export let width = 100;
  export let height = 100;
  let scale = 1;
  let base = { x: 0, y: 0 };
  let dragType: "" | "scroll" = "";

  const canvasDrag = useDrag((arg) => {
    switch (dragType) {
      case "scroll":
        base = { x: base.x - arg.d.x, y: base.y - arg.d.y };
        break;
    }
  });
  const onDownCanvas = (e: MouseEvent) => {
    canvasDrag.onDown(e);
    dragType = "scroll";
  };
  const onUp = (e: MouseEvent) => {
    dragType = "";
    canvasDrag.onUp();
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
  font-family="sans-serif"
  viewBox="{`${base.x} ${base.y} ${width * scale} ${height * scale}`}"
  {width}
  {height}
  on:mousedown|preventDefault="{onDownCanvas}"
  on:mousemove|preventDefault="{canvasDrag.onMove}"
  on:mouseup|preventDefault="{onUp}"
  on:mouseleave|preventDefault="{onUp}"
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

<style lang="scss">

</style>
