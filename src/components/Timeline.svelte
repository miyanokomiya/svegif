<script lang="typescript">
  import { canvas, setTimeline, patchScene, totalTime } from "../stores/canvas";

  let scenesWrapper: HTMLElement;
  let timelineDragging = false;
  let rangeDraggingTargetIndex = -1;
  let rangeDraggingFromX = 0;
  let rangeDraggingOrigin = 0;

  const moveTimeline = (e: MouseEvent) => {
    const rect = scenesWrapper.getBoundingClientRect();
    const rate = (e.pageX - rect.left) / rect.width;
    setTimeline(rate * $totalTime);
  };
  const onDownTimeline = (e: MouseEvent) => {
    timelineDragging = true;
    moveTimeline(e);
  };
  const onMoveTimeline = (e: MouseEvent) => {
    if (timelineDragging) {
      moveTimeline(e);
    }
    if (rangeDraggingTargetIndex !== -1) {
      moveRange(e);
    }
  };
  const onUpTimeline = (e: MouseEvent) => {
    if (timelineDragging) {
      moveTimeline(e);
    }
    if (rangeDraggingTargetIndex !== -1) {
      moveRange(e);
    }
    timelineDragging = false;
    rangeDraggingTargetIndex = -1;
    rangeDraggingFromX = 0;
    rangeDraggingOrigin = 0;
  };

  const moveRange = (e: MouseEvent) => {
    const range = rangeDraggingOrigin + (e.pageX - rangeDraggingFromX) * 10;
    if (range < 1) return;
    patchScene(rangeDraggingTargetIndex, { range });
  };
  const onDownRange = (index: number, e: MouseEvent) => {
    rangeDraggingTargetIndex = index;
    rangeDraggingFromX = e.pageX;
    rangeDraggingOrigin = $canvas.scenes[index].range;
    moveRange(e);
  };
</script>

<div class="root">
  <div
    class="timeline-wrapper"
    on:mousedown|preventDefault="{onDownTimeline}"
    on:mousemove|preventDefault="{onMoveTimeline}"
    on:mouseup|preventDefault="{onUpTimeline}"
  >
    <div class="timeline-content">
      <ul bind:this="{scenesWrapper}">
        {#each $canvas.scenes as scene, i}
          <li style="{`width: ${scene.range / 10}px;`}">
            <img src="{scene.image.base64}" alt="" />
            <div
              class="anchor"
              on:mousedown|preventDefault|stopPropagation="{(e) => onDownRange(i, e)}"
            >
              &lt;&lt;
            </div>
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
</div>

<style lang="scss">
  .root {
    background-color: #aaa;
  }
  .timeline-wrapper {
    display: flex;
    border: 1px solid #000;
  }
  .timeline-content {
    position: relative;
    display: inline-flex;
  }
  ul {
    display: flex;
    list-style: none;
    cursor: pointer;
  }
  li {
    position: relative;
    display: flex;
    border: 1px solid #aaa;

    img {
      height: 80px;
      width: 100%;
    }
    .anchor {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 36px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #aaa;
      border: 1px solid #000;
      cursor: move;
    }
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
