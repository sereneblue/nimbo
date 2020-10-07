<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { clickOutside } from "../../util";

  export let isOpen: boolean;

  const dispatch = createEventDispatcher();
  
  const handleClickOutside = (node: Node): object => {
    return clickOutside(node, () => {
      dispatch("close");
    });
  }

  const init = (): object => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch("close");
      }
    };

    window.addEventListener("keydown", handleKeyPress)

    return {
      destroy() {
        window.removeEventListener("keydown", handleKeyPress);
      }
    }
  };
</script>

{#if isOpen }
  <div use:init class="fixed w-full top-0 left-0 h-screen z-10 bg-dark-300-75" transition:fade={{ duration: 175 }}>
    <div class="bg-light-200 mt-24 w-3/4 md:w-2/3 xl:w-1/2 mx-auto rounded py-2 shadow-lg dark:bg-dark-200" use:handleClickOutside>
    	<slot isOpen={isOpen}></slot>
    </div>
  </div>
{/if}