<script lang="ts">
  import type { IVec2 } from 'okageo';

  export let scale: number = 1;
  export let from: IVec2;
  export let to: IVec2;
</script>

<g>
  <line
    x1="{from.x * scale}"
    y1="{from.y * scale}"
    x2="{to.x * scale}"
    y2="{to.y * scale}"
    stroke="red"
    stroke-dasharray="2 2"
    stroke-width="2"
  ></line>
</g>
