<script lang="typescript">
  import { canvas, setTimeline, totalTime } from "../stores/canvas";

  let scenesWrapper: HTMLElement;
  let dragging = false;

  const moveTimeline = (e: MouseEvent) => {
    const rect = scenesWrapper.getBoundingClientRect();
    const rate = (e.pageX - rect.left) / rect.width;
    setTimeline(rate * $totalTime);
  };
  const onDownTimeline = (e: MouseEvent) => {
    dragging = true;
    moveTimeline(e);
  };
  const onMoveTimeline = (e: MouseEvent) => {
    if (!dragging) return;
    moveTimeline(e);
  };
  const onUpTimeline = (e: MouseEvent) => {
    dragging = false;
    moveTimeline(e);
  };
</script>

<div class="root">
  <div class="timeline-wrapper">
    <ul
      bind:this="{scenesWrapper}"
      on:mousedown|preventDefault="{onDownTimeline}"
      on:mousemove|preventDefault="{onMoveTimeline}"
      on:mouseup|preventDefault="{onUpTimeline}"
    >
      {#each $canvas.scenes as scene}
        <li>
          <img
            src="{scene.image.base64}"
            style="{`width: ${scene.range / 10}px;`}"
            alt=""
          />
        </li>
      {/each}
    </ul>
    <div
      class="line"
      style="{`left: ${($canvas.timeline / $totalTime) * 100}%;`}"
    >
      <div></div>
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    display: flex;
    background-color: #aaa;
  }
  .timeline-wrapper {
    position: relative;
    display: inline-flex;
    border: 1px solid #000;
  }
  ul {
    display: flex;
    list-style: none;
  }
  li {
    display: flex;
    border: 1px solid #aaa;
  }
  img {
    height: 80px;
  }
  .line {
    position: absolute;
    top: 0;
    width: 13px;
    height: 100%;
    padding: 0 5px;
    transform: translateX(-50%);
    border-top: 3px solid blue;
    border-bottom: 3px solid blue;
    pointer-events: none;

    > div {
      width: 100%;
      height: 100%;
      background-color: blue;
    }
  }
</style>
