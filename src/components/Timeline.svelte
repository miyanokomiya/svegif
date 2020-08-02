<script lang="ts">
  import type { Point } from "../types";
  import {
    canvas,
    setTimeline,
    patchScene,
    moveScene,
    totalTime,
    getSumOfTime,
    getNearestSceneIndexAtTime,
  } from "../stores/canvas";
  import { useDrag } from "../utils/drag";
  import TicMark from "./TicMark.svelte";
  import TimelineScene from "./TimelineScene.svelte";

  const RANGE_PX_SCALE = 0.1;

  let scenesWrapper: HTMLElement;
  let dragType: "" | "timeline" | "range" | "sort" = "";
  let draggingTargetIndex = -1;
  let rangeDraggingOrigin = 0;
  let sortPoint: Point | null = null;

  const moveTimeline = (p: Point) => {
    const rect = scenesWrapper.getBoundingClientRect();
    const rate = (p.x - rect.left) / ($totalTime * RANGE_PX_SCALE);
    setTimeline(rate * $totalTime);
  };

  const moveRange = (arg: { base: Point; p: Point }) => {
    const range = rangeDraggingOrigin + (arg.p.x - arg.base.x) / RANGE_PX_SCALE;
    if (range < 1) return;
    patchScene(draggingTargetIndex, { range });
  };

  function getNearestGapTimeAt(time: number): number {
    const index = getNearestSceneIndexAtTime($canvas.scenes, time);
    return getSumOfTime($canvas.scenes.slice(0, index));
  }

  const canvasDrag = useDrag((arg) => {
    switch (dragType) {
      case "timeline":
        moveTimeline(arg.p);
        break;
      case "range":
        moveRange(arg);
        break;
      case "sort":
        const rect = scenesWrapper.getBoundingClientRect();
        sortPoint = { x: arg.p.x - rect.left, y: arg.p.y - rect.top };
        break;
    }
  });

  const onDownTimeline = (e: MouseEvent) => {
    dragType = "timeline";
    canvasDrag.onDown(e);
  };
  const onDownRange = (index: number, e: MouseEvent) => {
    dragType = "range";
    draggingTargetIndex = index;
    rangeDraggingOrigin = $canvas.scenes[index].range;
    canvasDrag.onDown(e);
  };
  const onDownSort = (index: number, e: MouseEvent) => {
    dragType = "sort";
    draggingTargetIndex = index;
    canvasDrag.onDown(e);
  };
  const onUp = () => {
    canvasDrag.onUp();
    switch (dragType) {
      case "sort":
        const index = getNearestSceneIndexAtTime(
          $canvas.scenes,
          sortPoint.x / RANGE_PX_SCALE
        );
        moveScene(draggingTargetIndex, index);
        break;
    }
    dragType = "";
    draggingTargetIndex = -1;
    rangeDraggingOrigin = 0;
    sortPoint = null;
  };

  $: timelineLeftPx = $canvas.timeline * RANGE_PX_SCALE;
  $: sortLineLeftPx = sortPoint
    ? getNearestGapTimeAt(sortPoint.x / RANGE_PX_SCALE) * RANGE_PX_SCALE
    : 0;
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
      <ul class="scenes" bind:this="{scenesWrapper}">
        {#each $canvas.scenes as scene, i}
          <li style="{`width: ${scene.range * RANGE_PX_SCALE}px;`}">
            <TimelineScene
              {scene}
              on:mouseDownRange="{({ detail }) => onDownRange(i, detail)}"
              on:mouseDownSort="{({ detail }) => onDownSort(i, detail)}"
            />
          </li>
        {/each}
      </ul>
      <TicMark rangePxScale="{RANGE_PX_SCALE}" totalTime="{$totalTime}" />
      <div class="line" style="{`left: ${timelineLeftPx}px;`}">
        <div></div>
      </div>
      {#if sortPoint}
        <div
          class="sort-dummy"
          style="{`width: ${$canvas.scenes[draggingTargetIndex].range * RANGE_PX_SCALE}px; left: ${sortPoint.x}px;`}"
        >
          <TimelineScene scene="{$canvas.scenes[draggingTargetIndex]}" />
        </div>
        <div class="sort-line" style="{`left: ${sortLineLeftPx}px;`}"></div>
      {/if}
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
    overflow: auto;
  }
  .timeline-content {
    position: relative;
    display: inline-flex;
    flex-direction: column;

    .scenes {
      display: flex;
      list-style: none;
      cursor: pointer;

      li {
        display: flex;
        border-right: 1px solid #aaa;
      }
    }
  }
  .line {
    position: absolute;
    top: 0;
    width: 13px;
    height: 100%;
    padding: 0 5px;
    transform: translateX(-50%);
    border-top: 3px solid red;
    border-bottom: 3px solid red;
    pointer-events: none;

    > div {
      width: 100%;
      height: 100%;
      background-color: red;
    }
  }
  .sort-dummy {
    position: absolute;
    top: 0;
    opacity: 0.5;
    transform: translateX(calc(-100% + 18px));
    pointer-events: none;
  }
  .sort-line {
    position: absolute;
    top: 0;
    width: 5px;
    height: 100%;
    transform: translateX(-50%);
    background-color: blue;
    pointer-events: none;
  }
</style>
