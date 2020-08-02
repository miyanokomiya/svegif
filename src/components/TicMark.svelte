<script lang="ts">
  export let rangePxScale: number;
  export let totalTime: number;

  $: width = 1000 * rangePxScale;
</script>

<div>
  <ul>
    {#each [...Array(Math.ceil(totalTime / 1000))] as _, i}
      <li style="{`width: ${width}px;`}">{i + 1}s</li>
    {/each}
  </ul>
</div>

<style lang="scss">
  ul {
    display: flex;
    list-style: none;
    cursor: pointer;
    border-top: solid 1px #000;
    background-color: #fff;
  }
  li {
    padding-right: 4px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-right: solid 1px #000;
  }
</style>
