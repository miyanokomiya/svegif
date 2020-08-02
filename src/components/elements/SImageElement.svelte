<script lang="ts">
  import type { ImageElement } from "../../types";
  export let element: ImageElement;
</script>

<image
  x="{element.x}"
  y="{element.y}"
  width="{element.width}"
  height="{element.height}"
  xlink:href="{element.base64}"
  xmlns:xlink="http://www.w3.org/1999/xlink"
></image>
