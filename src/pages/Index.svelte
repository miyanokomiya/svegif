<script lang="typescript">
  import { readImageFile } from "../utils/file";
  import { canvas, pushScene, currentScene } from "../stores/canvas";
  import Timeline from "../components/Timeline.svelte";
  import SCanvas from "../components/SCanvas.svelte";

  type FileEventTarget = EventTarget & { files: FileList };

  const onChangeFiles = (e: { target: FileEventTarget }) => {
    [...e.target.files].forEach((file) => {
      readImageFile(file).then((image) => {
        pushScene({ image, range: 1000 });
      });
    });
  };
  const dropFilesInCanvas = (
    e: { dataTransfer: FileEventTarget } | DragEvent
  ) => {
    [...e.dataTransfer.files].forEach((file) => {
      readImageFile(file).then((image) => {
        pushScene({ image, range: 1000 });
      });
    });
  };

  let fileInput: HTMLInputElement;
  const selectFiles = () => {
    fileInput?.click();
  };
</script>

<div>
  <div
    class="clip-canvas"
    on:dragover|preventDefault="{(e) => (e.dataTransfer.dropEffect = 'copy')}"
    on:dragleave|preventDefault
    on:drop|preventDefault="{dropFilesInCanvas}"
  >
    {#if $currentScene}
      <SCanvas />
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
  <Timeline />
</div>

<style lang="scss">
  .clip-canvas {
    width: 100%;
    height: 80vh;
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
</style>
