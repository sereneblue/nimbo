<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { clickOutside } from "../../util";

  export let isOpen: boolean;

  const dispatch = createEventDispatcher();
  
  const handleClickOutside = (node: Node): object => {
    return clickOutside(node, () => {
      if (isOpen) {
        dispatch("close");
      }
    });
  }
</script>

{#if isOpen }
  <div use:handleClickOutside class="absolute mt-2 z-10 rounded bg-light-100 dark:bg-dark-200 text-light dark:text-dark shadow-xl w-auto">
	 <slot isOpen={isOpen}></slot>
  </div>
{/if}