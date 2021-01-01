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

  const focus = (node): void => {
    node.querySelector('button').focus();
  }

  const handleListKeyEvent = (e: KeyboardEvent): void => {
    if (e.key == "Escape") {
      emit("close");
    } else if (e.key == "ArrowDown") {
      document.activeElement.nextElementSibling && document.activeElement.nextElementSibling.focus();
    } else if (e.key == "ArrowUp") {
      document.activeElement.previousElementSibling && document.activeElement.previousElementSibling.focus();
    }
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
    use:focus
    on:keydown={handleListKeyEvent}
    class="origin-top-right absolute right-0 w-40 z-10 rounded-md shadow-lg">
    <div class="rounded-md bg-white shadow-xs">
      <div
        class="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu">
        {#if index > 0}
          <button
            on:click={(e) => emit(['move', { from: index, to: index - 1}])}
            class="flex items-center w-full px-2 py-1 text-sm leading-5
              text-gray-700 hover:bg-gray-200 hover:text-gray-900
              focus:outline-none focus:bg-gray-200 focus:text-gray-900"
            role="menuitem">
            <svg
              class="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"><polyline
                points="15 18 9 12 15 6" /></svg> Move Left
          </button>
        {/if}
        {#if hasMore}
          <button
            on:click={(e) => emit(['move', { from: index, to: index + 1}])}
            class="flex items-center w-full px-2 py-1 text-sm leading-5
              text-gray-700 hover:bg-gray-200 hover:text-gray-900
              focus:outline-none focus:bg-gray-200 focus:text-gray-900"
            role="menuitem">
            <svg
              class="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"><polyline
                points="9 18 15 12 9 6" /></svg> Move Right
          </button>
        {/if}
        <button
          on:click={(e) => emit(['create', index])}
          class="flex items-center w-full px-2 py-1 text-sm leading-5
            text-gray-700 hover:bg-gray-200 hover:text-gray-900
            focus:outline-none focus:bg-gray-200 focus:text-gray-900"
          role="menuitem">
          <svg
            class="w-6 h-6 mr-1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line></svg> Create new list
        </button>
        <button
          on:click={(e) => emit(['delete'])}
          class="flex items-center w-full px-2 py-1 text-sm leading-5
            text-gray-700 hover:bg-gray-200 hover:text-gray-900
            focus:outline-none focus:bg-gray-200 focus:text-gray-900"
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
            <line x1="14" y1="11" x2="14" y2="17" /></svg> Delete
        </button>
      </div>
    </div>
  </div>
{/if}