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
</script>

{#if isOpen }
  <div class="absolute w-full top-0 h-screen z-10 bg-dark-300-75" transition:fade={{ duration: 175 }}>
    <div class="bg-light-200 mt-24 w-3/4 md:w-2/3 xl:w-1/2 mx-auto rounded py-2 shadow-lg dark:bg-dark-200" use:handleClickOutside>
    	<slot isOpen={isOpen}></slot>
    </div>
  </div>
{/if}