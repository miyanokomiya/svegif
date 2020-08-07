<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Scene } from "../types";

  export let scene: Scene;

  const dispatch = createEventDispatcher();
  function onMouseDownRange(e: MouseEvent) {
    dispatch("mouseDownRange", e);
  }
  function onMouseDownSort(e: MouseEvent) {
    dispatch("mouseDownSort", e);
  }
</script>

<div class="root">
  <div
    class="range-anchor"
    on:mousedown|preventDefault|stopPropagation="{onMouseDownRange}"
  >
    &lt;&lt;
  </div>
  <div
    class="sort-anchor"
    on:mousedown|preventDefault|stopPropagation="{onMouseDownSort}"
  >
    -
  </div>
</div>

<style lang="scss">
  .root {
    position: relative;
    width: 100%;
    display: flex;
    border-right: 1px solid #aaa;

    img {
      height: 80px;
      width: 100%;
    }
    .range-anchor,
    .sort-anchor {
      position: absolute;
      width: 36px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #aaa;
      border: 1px solid #000;
      cursor: move;
    }
    .range-anchor {
      bottom: 0;
      right: 0;
    }
    .sort-anchor {
      top: 0;
      right: 0;
    }
  }
</style>
