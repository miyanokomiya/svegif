<script lang="ts">
  import type { Layer } from "../types";
  import SElement from "./elements/SElement.svelte";
  import { canvas } from "../stores/canvas";

  export let layer: Layer;

  $: viewBox = `${$canvas.viewBox.x} ${$canvas.viewBox.y} ${$canvas.viewBox.width} ${$canvas.viewBox.height}`;
</script>

<div class="root">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    font-family="sans-serif"
    {viewBox}
    width="100%"
    height="100%"
  >
    {#each layer.elements as element}
      <SElement {element} />
    {/each}
  </svg>
</div>

<style lang="scss">
  .root {
    position: relative;
    width: 100%;
    height: 50px;
    display: flex;
    background-color: #fff;
    border-left: solid 1px #000;
    border-right: solid 1px #000;
  }
</style>
