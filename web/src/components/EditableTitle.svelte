<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let content: string;
  export let maxLength: number = 50;
  export let isTitle: boolean = false;

  const dispatch = createEventDispatcher();

  const handleTitleInput = (e: KeyboardEvent): void => {
    if (e.key == "Enter" && bufferContent) {
      content = bufferContent;
      hasFocus = false;

      dispatch("updateTitle", content);
    } else if (e.key == "Escape") {
      bufferContent = content;
      hasFocus = false;
    } else if (e.key == "/" || e.key == "l") {
      e.stopPropagation();
    }
  };

  const handleTitleBlur = (): void => {
    // On Chrome, if user presses Esc it also calls this function
    // Check if hasFocus is true before setting content

    if (hasFocus) {
      bufferContent = content;
      hasFocus = false;

      dispatch("updateTitle", content);
    }
  }

  const handleTitleClick = (): void => {
    hasFocus = true;
  };

  const init = (el: HTMLElement): void => {
    el.focus();
  };

  let hasFocus: boolean = false;
  let bufferContent: string = content;
</script>

<div class="min-w-0 w-full">
  {#if hasFocus}
    <input 
      on:keyup={handleTitleInput}
      on:blur={handleTitleBlur}
      class="w-full block px-2 font-semibold bg-light-100 dark:bg-dark-100 rounded"
      class:text-2xl={isTitle}
      class:text-xl={!isTitle}
      type="text"
      bind:value={bufferContent}
      maxlength={maxLength}
      use:init>
  {:else}
    <div class="min-w-0" on:click={handleTitleClick}>
      {#if isTitle}
        <h1 class="w-full text-2xl font-semibold truncate overflow-hidden whitespace-no-wrap" title={content}>
          <span class="hover:bg-light-200 dark:hover:bg-dark-200">{content}</span>
        </h1>
      {:else}
        <h2 class="w-full text-xl font-semibold truncate overflow-hidden whitespace-no-wrap" title={content}>
          <span class="hover:bg-light-100 dark:hover:bg-dark-100">{content}</span>
        </h2>
      {/if}
    </div>
  {/if}
</div>