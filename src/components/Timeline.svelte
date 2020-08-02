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

  const RANGE_PX_SCALE = 0.1;

  let scenesWrapper: HTMLElement;
  let dragType: "" | "timeline" | "range" | "sort" = "";
  let draggingTargetIndex = -1;
  let rangeDraggingOrigin = 0;
  let sortPoint: Point | null = null;

  const moveTimeline = (p: Point) => {
    const rect = scenesWrapper.getBoundingClientRect();
    const rate = (p.x - rect.left) / rect.width;
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
            <img src="{scene.image.base64}" alt="" />
            <div
              class="range-anchor"
              on:mousedown|preventDefault|stopPropagation="{(e) => onDownRange(i, e)}"
            >
              &lt;&lt;
            </div>
            <div
              class="sort-anchor"
              on:mousedown|preventDefault|stopPropagation="{(e) => onDownSort(i, e)}"
            >
              -
            </div>
          </li>
        {/each}
        {#if sortPoint}
          <li
            class="sort-dummy"
            style="{`width: ${$canvas.scenes[draggingTargetIndex].range * RANGE_PX_SCALE}px; left: ${sortPoint.x}px;`}"
          >
            <img
              src="{$canvas.scenes[draggingTargetIndex].image.base64}"
              alt=""
            />
            <div class="range-anchor">&lt;&lt;</div>
            <div class="sort-anchor">-</div>
          </li>
        {/if}
      </ul>
      <div class="tic-mark">
        <ul>
          {#each [...Array(Math.ceil($totalTime / 1000))] as _, i}
            <li>{i + 1}s</li>
          {/each}
        </ul>
      </div>
      <div
        class="line"
        style="{`left: ${($canvas.timeline / $totalTime) * 100}%;`}"
      >
        <div></div>
      </div>
      {#if sortPoint}
        <div
          class="sort-line"
          style="{`left: ${(getNearestGapTimeAt(sortPoint.x / RANGE_PX_SCALE) / $totalTime) * 100}%;`}"
        ></div>
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
        position: relative;
        display: flex;
        border-right: 1px solid #aaa;

        img {
          height: 80px;
          width: 100%;
        }
        .range-anchor,
        .sort-anchor {
          position: absolute;
          width: 36px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #aaa;
          border: 1px solid #000;
          cursor: move;
        }
        .range-anchor {
          bottom: 0;
          right: 0;
        }
        .sort-anchor {
          top: 0;
          right: 0;
        }
      }
      li.sort-dummy {
        position: absolute;
        opacity: 0.5;
        transform: translateX(calc(-100% + 18px));
      }
    }
    .tic-mark {
      ul {
        display: flex;
        list-style: none;
        cursor: pointer;
        border-top: solid 1px #000;
      }
      li {
        width: 100px;
        padding-right: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-right: solid 1px #000;
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
