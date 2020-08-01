<script lang="typescript">
  import type { Point } from "../types";
  import { canvas, setTimeline, patchScene, totalTime } from "../stores/canvas";
  import { useDrag } from "../utils/drag";

  let scenesWrapper: HTMLElement;
  let dragType: "" | "timeline" | "range" = "";
  let rangeDraggingTargetIndex = -1;
  let rangeDraggingOrigin = 0;

  const moveTimeline = (p: Point) => {
    const rect = scenesWrapper.getBoundingClientRect();
    const rate = (p.x - rect.left) / rect.width;
    setTimeline(rate * $totalTime);
  };

  const moveRange = (arg: { base: Point; p: Point }) => {
    const range = rangeDraggingOrigin + (arg.p.x - arg.base.x) * 10;
    if (range < 1) return;
    patchScene(rangeDraggingTargetIndex, { range });
  };

  const canvasDrag = useDrag((arg) => {
    switch (dragType) {
      case "timeline":
        moveTimeline(arg.p);
        break;
      case "range":
        moveRange(arg);
        break;
    }
  });

  const onDownTimeline = (e: MouseEvent) => {
    dragType = "timeline";
    canvasDrag.onDown(e);
  };
  const onDownRange = (index: number, e: MouseEvent) => {
    dragType = "range";
    rangeDraggingTargetIndex = index;
    rangeDraggingOrigin = $canvas.scenes[index].range;
    canvasDrag.onDown(e);
  };
  const onUp = () => {
    canvasDrag.onUp();
    dragType = "";
    rangeDraggingTargetIndex = -1;
    rangeDraggingOrigin = 0;
  };
</script>

<div class="root">
  <div
    class="timeline-wrapper"
    on:mousedown|preventDefault="{onDownTimeline}"
    on:mousemove|preventDefault="{canvasDrag.onMove}"
    on:mouseup|preventDefault="{onUp}"
    on:mouseleave|preventDefault="{onUp}"
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
