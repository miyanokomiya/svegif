<script lang="ts">
  import { canvas } from "../stores/canvas";
</script>

<ul>
  {#each $canvas.scenes as scene}
    <li>
      <img src="{scene.image.base64}" alt="" />
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    display: flex;
    list-style: none;
  }
  li {
    height: 80px;
    border: 1px solid #aaa;
  }
  img {
    height: 100%;
    width: auto;
  }
</style>
