<script lang="ts">
  import type { BaseElement, ImageElement } from '../../types';
  import SImageElement from './SImageElement.svelte';

  export let scale: number = 1;
  export let resizing: boolean = false;
  export let element: BaseElement;

  let imageElement: ImageElement | null;
  $: if (element) {
    switch (element.type) {
      case 'image':
        imageElement = element as ImageElement;
        break;
    }
  }
</script>

{#if imageElement}
  <SImageElement
    {scale}
    {resizing}
    element="{imageElement}"
    on:select
    on:update
  />
{/if}
