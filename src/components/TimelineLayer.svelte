<script lang="ts">
  import type { Layer } from "../types";

  export let layer: Layer;
</script>

<div class="root">
</div>

<style lang="scss">
  .root {
    position: relative;
    width: 100%;
    height: 50px;
    display: flex;
    background-color: #fff;
    border-left: solid 1px #000;
    border-right: solid 1px #000;
  }
</style>
