<script lang="ts">
  import type { BaseElement, ImageElement } from '../../types';
  import SImageElement from './SImageElement.svelte';

  export let scale: number;
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
  <SImageElement {scale} element="{imageElement}" on:update />
{/if}
