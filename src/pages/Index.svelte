<script lang="typescript">
  import { onMount } from "svelte";
  import type { ImageData } from "../types";
  import { readImageFile } from "../utils/file";
  import { canvas, pushLayer, currentScene } from "../stores/canvas";
  import { getLayer, getImageElement } from "../utils/layer";
  import Timeline from "../components/Timeline.svelte";
  import SCanvas from "../components/SCanvas.svelte";

  type FileEventTarget = EventTarget & { files: FileList };

  function pushPlainLayer() {
    pushLayer(getLayer({ from: $canvas.timeline, range: 1000 }));
  }

  function pushLayerFromImage(image: ImageData) {
    pushLayer(
      getLayer({
        from: $canvas.timeline,
        range: 1000,
        elements: [
          getImageElement({
            base64: image.base64,
            width: image.width,
            height: image.height,
          }),
        ],
      })
    );
  }

  const onChangeFiles = (e: { target: FileEventTarget }) => {
    [...e.target.files].forEach((file) => {
      readImageFile(file).then((image) => {
        pushLayerFromImage(image);
      });
    });
  };
  const dropFilesInCanvas = (
    e: { dataTransfer: FileEventTarget } | DragEvent
  ) => {
    [...e.dataTransfer.files].forEach((file) => {
      readImageFile(file).then((image) => {
        pushLayerFromImage(image);
      });
    });
  };

  let fileInput: HTMLInputElement;
  const selectFiles = () => {
    fileInput?.click();
  };

  let canvasWrapper: HTMLElement | null;
  let width = 100;
  let height = 100;
  function recalcCanvasSize() {
    if (!canvasWrapper) return;
    const rect = canvasWrapper.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }
  onMount(() => {
    recalcCanvasSize();
  });
</script>

<svelte:window on:resize="{recalcCanvasSize}" />
<div>
  <div
    class="clip-canvas"
    bind:this="{canvasWrapper}"
    on:dragover|preventDefault="{(e) => (e.dataTransfer.dropEffect = 'copy')}"
    on:dragleave|preventDefault
    on:drop|preventDefault="{dropFilesInCanvas}"
  >
    {#if $currentScene}
      <SCanvas {width} {height} />
    {:else}
      <button class="select-file-button" on:click="{selectFiles}">
        Drop or Select Images
      </button>
    {/if}
  </div>
  <input
    bind:this="{fileInput}"
    multiple
    type="file"
    accept="image/*"
    on:change="{onChangeFiles}"
  />
  <div class="timeline-block">
    <Timeline />
  </div>
  <div class="tool-block">
    <button on:click="{pushPlainLayer}">Add Layer</button>
  </div>
</div>

<style lang="scss">
  .clip-canvas {
    width: 100%;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ccc;
  }
  .select-file-button {
    padding: 2rem;
    background-color: #aaa;
  }
  input[type="file"] {
    display: none;
  }
  .timeline-block {
    height: 25vh;
    overflow: auto;
  }
  .tool-block {
    height: 10vh;
    overflow: auto;

    button {
      background-color: #4682b4;
      padding: 0.5rem 1rem;
      margin: 0;
    }
  }
</style>
