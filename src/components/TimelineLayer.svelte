<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Layer } from '../types';
  import SElement from './elements/SElement.svelte';
  import { canvas, elements } from '../stores/canvas';

  export let layer: Layer;

  $: viewBox = `${$canvas.viewBox.x} ${$canvas.viewBox.y} ${$canvas.viewBox.width} ${$canvas.viewBox.height}`;

  const dispatch = createEventDispatcher();
  function onMouseDownRangeLeft(e: MouseEvent) {
    dispatch('mouseDownRangeLeft', e);
  }
  function onMouseDownRangeRight(e: MouseEvent) {
    dispatch('mouseDownRangeRight', e);
  }
  function onMouseDownSort(e: MouseEvent) {
    dispatch('mouseDownSort', e);
  }
  function onMouseDownMove(e: MouseEvent) {
    dispatch('mouseDownMove', e);
  }
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
    {#each layer.elementKeys as elementKey (elementKey)}
      <SElement element="{$elements[elementKey]}" />
    {/each}
  </svg>
  <div
    class="range-anchor left"
    on:mousedown|preventDefault|stopPropagation="{onMouseDownRangeLeft}"
  ></div>
  <div
    class="range-anchor right"
    on:mousedown|preventDefault|stopPropagation="{onMouseDownRangeRight}"
  ></div>
  <div
    class="sort-anchor"
    on:mousedown|preventDefault|stopPropagation="{onMouseDownSort}"
  >
    ^
  </div>
  <div
    class="move-anchor"
    on:mousedown|preventDefault|stopPropagation="{onMouseDownMove}"
  >
    &gt;
  </div>
</div>

<style lang="scss">
  .root {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    background-color: #fff;
    border-left: solid 1px #000;
    border-right: solid 1px #000;
  }
  .range-anchor {
    position: absolute;
    width: 10px;
    height: 100%;
    background-color: #aaa;
    border: 1px solid #000;
    cursor: pointer;

    &.left {
      right: 100%;
    }
    &.right {
      left: 100%;
    }
  }
  .sort-anchor,
  .move-anchor {
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translateX(calc(100% + 10px));
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #aaa;
    border: 1px solid #000;
    cursor: pointer;
  }
  .sort-anchor {
    top: 0;
    right: 0;
  }
  .move-anchor {
    bottom: 0;
    right: 0;
  }
</style>
