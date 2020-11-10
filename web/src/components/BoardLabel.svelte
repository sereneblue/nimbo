<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Popover from './base/Popover.svelte';
  import type nimbo from '../nimbo';
  import { LABEL_COLOR } from '../types';
  import type { BoardLabel } from '../types';

  export let isOpen: boolean = false;
  export let labels: BoardLabel[];
  
  const dispatch = createEventDispatcher();

  let selectedColor: LABEL_COLOR = null;

  const focus = (node: Node): void => {
    node.focus();
  }

  const handleButtonClick = (): void => {
    isOpen = true;
  }

  const handleClose = (e: CustomEvent): void => {
    isOpen = false;
    selectedColor = null;
  }

  const handleEditLabelClick = (color: LABEL_COLOR): void => {
    selectedColor = color;
  }

  const handleInputBlur = (e: Event): void => {
    selectedColor = null;
  }

  const handleLabelInput = (e: KeyboardEvent): void => {
    if (e.key == "Enter" && e.target.value) {
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].color == e.target.dataset.color) {
          labels[i].text = e.target.value;

          dispatch("update", labels);
          break;
        }
      }

      e.target.blur();
    }
  }

  const handleShortcuts = (e: KeyboardEvent): void => {
    if (e.key == "/" || e.key == "l") {
      e.stopPropagation();
    }
  }
</script> 

<div>
  <button on:click={handleButtonClick} class="py-1 px-2 rounded text-xs bg-indigo-600 text-white hover:bg-indigo-700">Labels</button>

  <Popover {isOpen} on:close={handleClose}>
    <ul tabindex="-1" role="listbox" class="text-base w-40 py-1 leading-6 focus:outline-none w-80">
      {#each labels as l (l)}
        <li role="option" class="select-none relative py-2 pl-3 pr-9">
          <div class="flex items-center space-x-2 mr-2">
            <span
              class="flex-shrink-0 rounded-full w-4 h-4"
              class:bg-red-500={l.color == LABEL_COLOR.RED}
              class:bg-orange-500={l.color == LABEL_COLOR.ORANGE}
              class:bg-yellow-500={l.color == LABEL_COLOR.YELLOW}
              class:bg-green-500={l.color == LABEL_COLOR.GREEN}
              class:bg-teal-500={l.color == LABEL_COLOR.TEAL}
              class:bg-blue-500={l.color == LABEL_COLOR.BLUE}
              class:bg-purple-500={l.color == LABEL_COLOR.PURPLE}></span>
            {#if selectedColor == l.color}
              <input use:focus on:blur={handleInputBlur} on:keyup={handleShortcuts} on:keydown={handleLabelInput} data-color={l.color} class="block rounded w-full px-1 focus:bg-light-300 dark:focus:bg-dark-100 border border-transparent border-dashed hover:border-light dark:hover:border-dark" value={l.text}>
            {:else}
              <span class="block truncate py-0.5">
                {l.text}
              </span>
            {/if}
          </div>
          <button on:click={e => handleEditLabelClick(l.color)} class="absolute mx-auto opacity-50 hover:opacity-100 inset-y-0 right-0 flex items-center px-2 focus:bg-light-300 dark:focus:bg-dark-100 outline-none" title="Edit label">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        </li>
      {/each}
    </ul>
  </Popover>
</div>