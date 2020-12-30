<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { clickOutside } from '../../util';

  export let options: any;
  export let selected: string[];

  const dispatch = createEventDispatcher();

  let selectedValues = [];
  let displayText: string = "";
  let open: boolean = false;

  $: {
    if (options.length === 0) {
      displayText = `No boards available`;
    } else if (selectedValues.includes('all') && options.length) {
      displayText = `All ${options.length} board(s) selected`;
    } else if (selectedValues.length === 1) {
      displayText = options.find(o => o.value == selectedValues[0]).name;
    } else if (selectedValues.length) {
      displayText = `${selectedValues.length} board(s) selected`;
    } else {
      displayText = 'No boards selected';
    }
  }

  $: allSelected = selectedValues.includes('all');

  $: dropdownOptions = [
    { name: 'Select all', value: 'all' }
  ].concat(options);

  const handleClickOutside = (node): object => {
    return clickOutside(node, function() {
      open = false;
    })
  };

  const handleOptionClick = (o: string): void => {
    let index: number = selectedValues.indexOf(o);

    if (index > -1) {
      if (o === 'all') {
        selectedValues = [];
      } else {
        selectedValues.splice(index, 1);

        let allIndex: number = selectedValues.indexOf('all');
        if (allIndex > -1) {
          selectedValues.splice(allIndex, 1);
        }
      }
    } else {
      if (o === 'all') {
        selectedValues = ['all'].concat(options.map(opt => opt.value));
      } else {
        selectedValues.push(o);
      }
    }

    if (!selectedValues.includes('all') && selectedValues.length === options.length) {
      selectedValues.push('all');
    }

    selectedValues = selectedValues;
    
    dispatch("update", selectedValues);
  }

  const handleMultiselectClick = (): void => {
    if (!(selectedValues.length === 1 && selectedValues[0] === 'all')) {
      open = !open;
    }
  }

  onMount(() => {
    let allSelected: boolean = selected.includes('all');
    let optionValues: string[] = options.map(o => o.value);

    if (allSelected) selectedValues.push('all');

    for (let i = 0; i < optionValues.length; i++) {
      if (allSelected || selected.includes(optionValues[i])) {
        selectedValues.push(optionValues[i]);
      }
    }

    selectedValues = selectedValues;
  })
</script>

<style lang="postcss" global>
  .inFocus, .dark .inFocus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
    @apply border border-indigo-400;
  }
</style>

<div class="relative">
  <div on:click={handleMultiselectClick} class="form-select p-1.5 mt-1 bg-white dark:bg-dark-200 border border-light-200 dark:border-transparent w-full"
  class:inFocus={open}>
    {displayText}
  </div>
  {#if open}
    <div use:handleClickOutside transition:fade="{{ duration: 150 }}" class="absolute mt-0.5 w-full h-auto max-h-40 rounded-sm w-auto bg-light-100 dark:bg-dark-200 shadow-lg overflow-y-auto">
      <div class="flex flex-col">
        {#each dropdownOptions as o (o.value)}
          <label on:click|preventDefault={() => handleOptionClick(o.value)} class="flex items-center p-2 hover:bg-light-200 dark:hover:bg-dark-100 cursor-pointer">
            <input type="checkbox" class="form-checkbox text-indigo-500" checked={selectedValues.includes(o.value) || allSelected } value={o.value}>
            <span class="ml-2">{o.name}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}
</div>