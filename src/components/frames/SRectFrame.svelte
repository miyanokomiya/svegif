<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Rect } from '../../types';
  import { useDrag } from '../../utils/drag';
  import * as geo from '../../utils/geo';
  import SCornerAnchor from '../svg/SCornerAnchor.svelte';

  export let scale: number = 1;
  export let rect: Rect;

  const dispatch = createEventDispatcher();
  let dragType: '' | 'LT' | 'RT' | 'RB' | 'LB' = '';
  let draggingRectOrigin: Rect | null = null;

  function dispatchResize(resized: Partial<Rect>) {
    dispatch('resize', { ...rect, ...resized });
  }

  const resizeDrag = useDrag((arg) => {
    const scaledDiff = {
      x: (arg.p.x - arg.base.x) * scale,
      y: (arg.p.y - arg.base.y) * scale,
    };

    switch (dragType) {
      case 'LT':
        dispatchResize({
          ...geo.resizeByLeft(draggingRectOrigin, scaledDiff.x),
          ...geo.resizeByTop(draggingRectOrigin, scaledDiff.y),
        });
        break;
      case 'RT':
        dispatchResize({
          ...geo.resizeByRight(draggingRectOrigin, scaledDiff.x),
          ...geo.resizeByTop(draggingRectOrigin, scaledDiff.y),
        });
        break;
      case 'RB':
        dispatchResize({
          ...geo.resizeByRight(draggingRectOrigin, scaledDiff.x),
          ...geo.resizeByBottom(draggingRectOrigin, scaledDiff.y),
        });
        break;
      case 'LB':
        dispatchResize({
          ...geo.resizeByLeft(draggingRectOrigin, scaledDiff.x),
          ...geo.resizeByBottom(draggingRectOrigin, scaledDiff.y),
        });
        break;
    }
  });
  const onDownResize = (type: typeof dragType, e: MouseEvent) => {
    dragType = type;
    draggingRectOrigin = { ...rect };
    resizeDrag.onDown(e);
  };
  const onUpResize = () => {
    dragType = '';
    draggingRectOrigin = null;
    resizeDrag.onUp();
  };
</script>

<svelte:window
  on:mousemove="{resizeDrag.onMove}"
  on:mouseup="{onUpResize}"
  on:mouseleave="{onUpResize}"
/>
<g transform="{`translate(${rect.x} ${rect.y})`}">
  <slot />
  <g
    class="corner"
    transform="{`rotate(-45) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDownResize('LT', e)}"
  >
    <SCornerAnchor />
  </g>
  <g
    class="corner"
    transform="{`translate(${rect.width} 0) rotate(45) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDownResize('RT', e)}"
  >
    <SCornerAnchor />
  </g>
  <g
    class="corner"
    transform="{`translate(${rect.width} ${rect.height}) rotate(135) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDownResize('RB', e)}"
  >
    <SCornerAnchor />
  </g>
  <g
    class="corner"
    transform="{`translate(0 ${rect.height}) rotate(225) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDownResize('LB', e)}"
  >
    <SCornerAnchor />
  </g>
</g>

<style>
  .corner {
    cursor: pointer;
  }
</style>
