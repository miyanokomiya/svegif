<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ImageElement, Rect } from '../../types';
  import SRectFrame from '../frames/SRectFrame.svelte';

  export let scale: number = 1;
  export let resizing: boolean = false;
  export let element: ImageElement;

  const dispatch = createEventDispatcher();
  function update(rect: Rect) {
    dispatch('update', { ...element, ...rect });
  }
</script>

<SRectFrame
  {scale}
  {resizing}
  rect="{element}"
  keepAspect
  on:resize="{({ detail }) => update(detail)}"
  on:select
>
  <image
    x="0"
    y="0"
    width="{element.width}"
    height="{element.height}"
    xlink:href="{element.base64}"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  ></image>
</SRectFrame>
