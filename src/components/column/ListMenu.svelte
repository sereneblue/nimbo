<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import { clickOutside } from "../../util";

  export let isOpen: boolean;
  export let index: number;
  export let hasMore: boolean;

  const dispatch = createEventDispatcher();

  const emit = (data: any): void => {
    dispatch("emit", data);
  }

  const handleClickOutside = (node): object => {
    return clickOutside(node, () => {
      emit("close");
    })
  };
</script>

{#if isOpen}
  <div
    transition:fade={{ duration: 150 }}
    use:handleClickOutside
    class="origin-top-right absolute right-0 w-auto z-10 rounded shadow-lg">
    <div class="rounded border border-indigo-500 bg-light-100 dark:bg-dark-200 text-light dark:text-dark shadow-xl">
      <div
        class="flex"
        role="menu"
        aria-orientation="horizontal"
        aria-labelledby="options-menu">
        {#if index > 0}
          <button
            on:click={(e) => emit(['move', { from: index, to: index - 1}])}
            class="flex items-center w-full p-2 text-sm leading-5
              hover:bg-light-200 dark:hover:bg-dark-100-50"
            role="menuitem">
            <svg
              class="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"><polyline
                points="15 18 9 12 15 6" /></svg>
          </button>
        {/if}
        {#if hasMore}
          <button
            on:click={(e) => emit(['move', { from: index, to: index + 1}])}
            class="flex items-center w-full p-2 text-sm leading-5
              hover:bg-light-200 dark:hover:bg-dark-100-50"
            role="menuitem">
            <svg
              class="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"><polyline
                points="9 18 15 12 9 6" /></svg>
          </button>
        {/if}
        <button
          on:click={(e) => emit(['create', index])}
          class="flex items-center w-full p-2 text-sm leading-5
              hover:bg-light-200 dark:hover:bg-dark-100-50"
          role="menuitem">
          <svg
            class="w-6 h-6 mr-1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button
          on:click={(e) => emit(['delete'])}
          class="flex items-center w-full p-2 text-sm leading-5
              hover:bg-light-200 dark:hover:bg-dark-100-50"
          role="menuitem">
          <svg
            class="w-6 h-6 mr-1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"><polyline points="3 6 5 6 21 6" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" /></svg>
        </button>
      </div>
    </div>
  </div>
{/if}