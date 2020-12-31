<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let content: string;
  export let isTitle: boolean = false;

  let bufferContent: string = content;
  let hasFocus: boolean = false;

  const dispatch = createEventDispatcher();

  const handleTitleFocus = (e: FocusEvent): void => {
    hasFocus = true;
  }

  const handleTitleInput = (e: KeyboardEvent): void => {
    if (e.key == "Enter") {
      e.preventDefault();

      if (e.target.textContent) {
        content = e.target.textContent;
        e.target.blur();
      }
    } else if (e.key == "Escape") {
      e.target.blur();
    }
  };

  const handleTitleBlur = (e: FocusEvent): void => {
    hasFocus = false;
    bufferContent = content;
    e.target.scrollTop = 0;
    dispatch("updateTitle", content);
  }

  const handlePasteEvent = (node: Node): object => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    }

    node.addEventListener("paste", handlePaste);

    return {
      destroy() {
        document.removeEventListener("paste", handlePaste);
      },
    };
  }

  $: {
    bufferContent = content;
  }
</script>

<style>
  span[contenteditable]:empty:before {
    content: "\feff";
  }
</style>

<div class="min-w-0 w-full">
  <div class="min-w-0 editable-title">
    {#if isTitle}
      <h1 class="w-full text-2xl font-semibold" title={bufferContent}>
        <span use:handlePasteEvent on:keyup|stopPropagation on:keydown={handleTitleInput} on:focus={handleTitleFocus} on:blur={handleTitleBlur} contenteditable class="block w-full focus:bg-light-100 dark:focus:bg-dark-100 border border-transparent border-dashed break-words hover:border-light dark:hover:border-dark rounded p-1" class:truncate-2-lines={!hasFocus} bind:textContent={bufferContent}></span>
      </h1>
    {:else}
      <h2 class="w-full text-xl font-semibold pr-2" title={bufferContent}> 
        <span use:handlePasteEvent on:keyup|stopPropagation on:keydown={handleTitleInput} on:focus={handleTitleFocus} on:blur={handleTitleBlur} contenteditable class="block w-full focus:bg-light-300 dark:focus:bg-dark-100 border border-transparent border-dashed break-words hover:border-light dark:hover:border-dark rounded p-1" class:truncate-3-lines={!hasFocus} bind:textContent={bufferContent}></span>
      </h2>
    {/if}
  </div>
</div>