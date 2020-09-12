<script lang="ts">
  export let isCenter: boolean = false;
  export let content: string;
  export let maxLength: number = 50;
  export let tag: string;

  const handleTitleInput = (e: KeyboardEvent): void => {
    if (e.key == "Enter" && bufferContent) {
      content = bufferContent;
      hasFocus = false;
    } else if (e.key == "Escape") {
      hasFocus = false;
    }
  };

  const handleTitleBlur = (): void => {
    content = bufferContent;
    hasFocus = false;
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

<style lang="postcss">
  h1 {
    @apply w-full text-2xl font-semibold truncate overflow-hidden whitespace-no-wrap;
  }

  h2 {
    @apply w-full text-xl font-semibold truncate overflow-hidden whitespace-no-wrap;
  }

  input {
    @apply w-full block bg-white px-2 font-semibold;
  }
</style>

<div class="min-w-0" class:text-center={isCenter}>
  {#if hasFocus}
    <input 
      on:keydown={handleTitleInput}
      on:blur={handleTitleBlur}
      class:text-2xl={tag === "h1"}
      class:text-xl={tag === "h2"}
      class:text-center={isCenter}
      type="text"
      bind:value={bufferContent}
      maxlength={maxLength}
      use:init>
  {:else}
    <div class="min-w-0" on:click={handleTitleClick}>
      {#if tag == "h1"}
        <h1 title={content}>{content}</h1>
      {:else}
        <h2 title={content}>{content}</h2>
      {/if}
    </div>
  {/if}
</div>