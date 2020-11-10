<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Popover from '../base/Popover.svelte';
  import { LABEL_COLOR } from '../../types';
  import type { BoardLabel } from '../../types';

  export let selected: LABEL_COLOR;
  export let labels: BoardLabel[];

  let isOpen: boolean = false;
  let selectedText: string;

  const dispatch = createEventDispatcher();

  const handleClose = (e: CustomEvent): void => {
    isOpen = false;
  }

  const handleLabelClick = (): void => {
    isOpen = !isOpen;
  }

  const handleSelectLabel = (color: LABEL_COLOR): void => {
    dispatch("update", color);

    selected = color;
    isOpen = false;
  }

  $: {
    if (selected) {
      selectedText = labels.find(l => l.color == selected).text;
    }
  }
</script>

<div class="space-y-1">
  <div class="relative">
    <span class="inline-block w-full rounded-md shadow-sm">
      <button on:click={handleLabelClick} type="button" aria-haspopup="listbox" aria-expanded="true" class="flex items-center px-1 bg-light-100 dark:bg-dark-200 text-light dark:text-dark rounded cursor-default relative w-64 pl-2 pr-10 py-1 text-left">
        <div class="flex items-center space-x-2 truncate">
          {#if selected}
            <span
              class="flex-shrink-0 rounded-full w-4 h-4"
              class:bg-red-500={selected == LABEL_COLOR.RED}
              class:bg-orange-500={selected == LABEL_COLOR.ORANGE}
              class:bg-yellow-500={selected == LABEL_COLOR.YELLOW}
              class:bg-green-500={selected == LABEL_COLOR.GREEN}
              class:bg-teal-500={selected == LABEL_COLOR.TEAL}
              class:bg-blue-500={selected == LABEL_COLOR.BLUE}
              class:bg-purple-500={selected == LABEL_COLOR.PURPLE}></span>
            <span class="block truncate">
              {selectedText}
            </span>
          {:else}
            Select a label...
          {/if}
        </div>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>
    </span>
    
    <Popover {isOpen} on:close={handleClose}>
      <ul tabindex="-1" role="listbox" aria-activedescendant="listbox-item-3" class="max-h-56 w-64 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
        {#each labels as l (l)}
          <li on:click={e => handleSelectLabel(l.color)} data-label={l.color} role="option" class="hover:bg-light-200 dark:hover:bg-dark-100 dark:hover:bg-dark-100 cursor-pointer select-none relative py-2 pl-3 pr-9">
            <div class="flex items-center space-x-2">
              <span
                class="flex-shrink-0 rounded-full w-4 h-4"
                class:bg-red-500={l.color == LABEL_COLOR.RED}
                class:bg-orange-500={l.color == LABEL_COLOR.ORANGE}
                class:bg-yellow-500={l.color == LABEL_COLOR.YELLOW}
                class:bg-green-500={l.color == LABEL_COLOR.GREEN}
                class:bg-teal-500={l.color == LABEL_COLOR.TEAL}
                class:bg-blue-500={l.color == LABEL_COLOR.BLUE}
                class:bg-purple-500={l.color == LABEL_COLOR.PURPLE}></span>
              <span class="font-normal block truncate">
                {l.text}
              </span>
            </div>

            {#if selected === l.color}
              <span class="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            {/if}
          </li>
        {/each}
      </ul>
    </Popover>
  </div>
</div>