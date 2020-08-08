<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import { drawing, geo } from 'okageo';
  import type { IRectangle } from 'okageo';
  import { cursor } from '../../stores/cursor';
  import type { Point, Rect } from '../../types';
  import { useDrag } from '../../utils/drag';
  import SMoveAnchor from '../svg/SMoveAnchor.svelte';
  import SRotateAnchor from '../svg/SRotateAnchor.svelte';
  import SCornerAnchor from '../svg/SCornerAnchor.svelte';
  import SAnchorConnectLine from '../svg/SAnchorConnectLine.svelte';

  export let scale: number = 1;
  export let resizing: boolean = false;
  export let rect: Rect;
  export let keepAspect: boolean = false;

  function getRectCenter(rec: IRectangle): Point {
    return {
      x: rec.x + rec.width / 2,
      y: rec.y + rec.height / 2,
    };
  }

  const dispatch = createEventDispatcher();
  let dragType: '' | 'move' | 'rotate' | 'LT' | 'RT' | 'RB' | 'LB' = '';
  let draggingRectOrigin: Rect | null = null;

  function dispatchResize(resized: Partial<Rect>) {
    dispatch('resize', { ...rect, ...resized });
  }

  const resizeDrag = useDrag((arg) => {
    if (dragType === '') return;
    const scaledDiff = geo.multi(geo.sub(arg.p, arg.base), scale);
    const center = getRectCenter(draggingRectOrigin);

    const scaledBase = geo.multi(arg.base, scale);
    const scaledP = geo.multi(arg.p, scale);

    switch (dragType) {
      case 'move':
        dispatchResize(geo.add(draggingRectOrigin, scaledDiff));
        break;
      case 'rotate':
        {
          const anchorP = geo.rotate(
            { x: center.x, y: draggingRectOrigin.y - 20 * scale },
            draggingRectOrigin.radian,
            center
          );
          // add 'Math.PI/2' to adjust anchor's radian
          const nextRad =
            Math.PI / 2 + geo.getRadian(geo.add(anchorP, scaledDiff), center);
          dispatchResize({ radian: nextRad });
        }
        break;
      case 'LT':
        dispatchResize(
          drawing.resizeRectByLeftTopWithRotation(
            draggingRectOrigin,
            scaledBase,
            scaledP,
            draggingRectOrigin.radian,
            keepAspect
          )
        );
        break;
      case 'RT':
        dispatchResize(
          drawing.resizeRectByRightTopWithRotation(
            draggingRectOrigin,
            scaledBase,
            scaledP,
            draggingRectOrigin.radian,
            keepAspect
          )
        );
        break;
      case 'RB':
        dispatchResize(
          drawing.resizeRectByRightBottomWithRotation(
            draggingRectOrigin,
            scaledBase,
            scaledP,
            draggingRectOrigin.radian,
            keepAspect
          )
        );
        break;
      case 'LB':
        dispatchResize(
          drawing.resizeRectByLeftBottomWithRotation(
            draggingRectOrigin,
            scaledBase,
            scaledP,
            draggingRectOrigin.radian,
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
  async function select(e: MouseEvent) {
    dispatch('select');
    await tick();
    if (resizing) {
      onDown('move', e);
    }
  }

  $: transform = [
    `translate(${rect.x} ${rect.y})`,
    `rotate(${(rect.radian / Math.PI) * 180}, ${rect.width / 2}, ${
      rect.height / 2
    })`,
  ].join(' ');
</script>

<svelte:window
  on:mousemove="{resizeDrag.onMove}"
  on:mouseup="{onUpResize}"
  on:mouseleave="{onUpResize}"
/>
<g {transform} on:mousedown|preventDefault|stopPropagation="{select}">
  <slot />
  {#if resizing}
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
    <SAnchorConnectLine
      {scale}
      from="{{ x: rect.width / 2 / scale, y: 0 }}"
      to="{{ x: rect.width / 2 / scale, y: -20 }}"
    />
    <g
      class="anchor"
      transform="{`translate(${rect.width / 2} ${-20 * scale}) scale(${scale})`}"
      on:mousedown|preventDefault|stopPropagation="{(e) => onDown('rotate', e)}"
    >
      <SRotateAnchor />
    </g>
    <rect
      width="{rect.width}"
      height="{rect.height}"
      fill="rgba(0,0,255, 0.3)"
      stroke="none"
      on:mousedown|preventDefault|stopPropagation="{(e) => onDown('move', e)}"
    ></rect>
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
  {/if}
</g>

<style>
  .anchor {
    cursor: pointer;
  }
</style>
