<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { drawing, geo } from 'okageo';
  import { cursor } from '../../stores/cursor';
  import type { Rect } from '../../types';
  import { useDrag } from '../../utils/drag';
  import SMoveAnchor from '../svg/SMoveAnchor.svelte';
  import SCornerAnchor from '../svg/SCornerAnchor.svelte';
  import SAnchorConnectLine from '../svg/SAnchorConnectLine.svelte';

  export let scale: number = 1;
  export let rect: Rect;
  export let keepAspect: boolean = false;

  const dispatch = createEventDispatcher();
  let dragType: '' | 'move' | 'LT' | 'RT' | 'RB' | 'LB' = '';
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
      case 'move':
        dispatchResize({
          x: draggingRectOrigin.x + scaledDiff.x,
          y: draggingRectOrigin.y + scaledDiff.y,
        });
        break;
      case 'LT':
        dispatchResize(
          drawing.resizeRectByLeftTop(
            draggingRectOrigin,
            scaledDiff,
            keepAspect
          )
        );
        break;
      case 'RT':
        dispatchResize(
          drawing.resizeRectByRightTop(
            draggingRectOrigin,
            scaledDiff,
            keepAspect
          )
        );
        break;
      case 'RB':
        dispatchResize(
          drawing.resizeRectByRightBottom(
            draggingRectOrigin,
            scaledDiff,
            keepAspect
          )
        );
        break;
      case 'LB':
        dispatchResize(
          drawing.resizeRectByLeftBottom(
            draggingRectOrigin,
            scaledDiff,
            keepAspect
          )
        );
        break;
    }
  });
  const onDown = (type: typeof dragType, e: MouseEvent) => {
    cursor.set('pointer');
    dragType = type;
    draggingRectOrigin = { ...rect };
    resizeDrag.onDown(e);
  };
  const onUpResize = () => {
    cursor.clear();
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
  <SAnchorConnectLine
    {scale}
    from="{{ x: -20, y: -20 }}"
    to="{{ x: 0, y: 0 }}"
  />
  <g
    class="anchor"
    transform="{`translate(${-20 * scale} ${-20 * scale}) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDown('move', e)}"
  >
    <SMoveAnchor />
  </g>
  <g
    class="anchor"
    transform="{`rotate(-45) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDown('LT', e)}"
  >
    <SCornerAnchor />
  </g>
  <g
    class="anchor"
    transform="{`translate(${rect.width} 0) rotate(45) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDown('RT', e)}"
  >
    <SCornerAnchor />
  </g>
  <g
    class="anchor"
    transform="{`translate(${rect.width} ${rect.height}) rotate(135) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDown('RB', e)}"
  >
    <SCornerAnchor />
  </g>
  <g
    class="anchor"
    transform="{`translate(0 ${rect.height}) rotate(225) scale(${scale})`}"
    on:mousedown|preventDefault|stopPropagation="{(e) => onDown('LB', e)}"
  >
    <SCornerAnchor />
  </g>
</g>

<style>
  .anchor {
    cursor: pointer;
  }
</style>
