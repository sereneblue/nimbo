<script lang="ts">
  import { afterUpdate, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { push } from 'svelte-spa-router';
  import fuzzysort from 'fuzzysort';

  import { clickOutside } from '../util';
  import { RESULT_TYPE } from '../types';
  import type { SearchObject } from '../types';
  import type nimbo from '../nimbo';  

  let nimboStore: Writable<nimbo> = getContext('nimbo');
  let resultList: HTMLElement;
  let query: string = "";
  let searchResults: any[] = [];
  let searchList: SearchObject[] = [];

  $: {
    searchList = $nimboStore.everything();
  }

  $: {
    let q: string = query;
    let sl = searchList;

    if (query.startsWith("b/")) {
      q = query.replace('b/', '');
      sl = searchList.filter(s => s.type == RESULT_TYPE.BOARD);
    } else if (query.startsWith("c/")) {
      q = query.replace('c/', '');
      sl = searchList.filter(s => s.type == RESULT_TYPE.CARD);  
    }

    if (!q) {
      searchResults = sl.map(s => {
        return { obj: s }
      });
    } else {
      searchResults = fuzzysort.go(q, sl, {
        limit: 12,
        allowTypo: false,
        key: 'text'
      });
    }
    
    searchResults = searchResults.sort((a, b) => {
      if (a.obj.type < b.obj.type){
        return -1;  
      } else if (a.obj.type > b.obj.type){
        return 1;
      }

      return 0;
    }).slice(0, 12);
  }

  afterUpdate(() => {
    if (searchResults.length && resultList) {
      resultList.querySelector('li').classList.add('focused');
    }
  });

  const handleClickOutside = (node): object => {
    return clickOutside(node, function() {
      $nimboStore.closePalette();
      $nimboStore = $nimboStore;
    })
  };

  const handleResultsEvent = (e: KeyboardEvent, s: Search): void => {
    if (e.key == "ArrowUp") {
      if (e.target.previousElementSibling) {
        e.target.classList.remove('focused')
        e.target.previousElementSibling.classList.add('focused');
        e.target.previousElementSibling.focus();
      } else {
        document.querySelector('#cmdInput').focus();
      }
    } else if (e.key == "ArrowDown") {
      if (e.target.nextElementSibling) {
        e.target.classList.remove('focused')
        e.target.nextElementSibling.classList.add('focused');
        e.target.nextElementSibling.focus();
      }
    } else if (e.key == "Escape") {
      $nimboStore.closePalette();
      $nimboStore = $nimboStore;
    } else if (e.key == "Enter") {
      execAction(s);
    }
  }

  const handleSearchInput = (e: KeyboardEvent): void => {
    if (e.key == "ArrowDown") {
      let elements: HTMLElement[] = Array.from(document.querySelectorAll('.result'));
      
      if (elements.length > 1) {
        elements[0].classList.remove('focused');
        elements[1].classList.add('focused');
        elements[1].focus();
      } else if (elements.length == 1) {
        elements[0].classList.add('focused');
        elements[0].focus();
      }
    } else if (e.key == "Escape") {
      $nimboStore.closePalette();
      $nimboStore = $nimboStore;
    } else if (e.key == "Enter") {
      let elements: HTMLElement[] = Array.from(document.querySelectorAll('.result'));

      if (elements.length) {
        elements[0].click();
      }
    } else if (e.key === "l" || e.key === "h") {
      e.stopPropagation();
    }
  }

  const execAction = (s: Search): void => {
    $nimboStore.closePalette();
    $nimboStore.setSelectedCard(null);
    $nimboStore = $nimboStore;
  
    push(s.obj.path);
  }

  const init = (): void => {
    query = "";
    let el: HTMLInputElement = document.querySelector("#cmdInput");
    el.value = "";
    el.focus();
  }
</script>

<style lang="postcss" global>
  .focused {
    @apply bg-light-100;
  }
  
  .dark .focused {
    @apply bg-dark-100;
  }
</style>

{#if $nimboStore.showCommandPalette }
  <div use:init class="absolute w-full top-0 left-0 h-screen z-10 bg-dark-300-75" transition:fade={{ duration: 100 }}>
    <div class="bg-light-200 dark:bg-dark-200 mt-24 w-3/4 md:w-2/3 xl:w-1/2 mx-auto rounded py-2 shadow-lg" use:handleClickOutside>
      <div class="px-2">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute text-dark m-4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input id="cmdInput" class="dark:text-dark dark:bg-dark-300 text-light text-2xl pl-12 pr-2 py-2 w-full bg-light-300 border border-transparent border-blue-500 appearance-none leading-normal rounded outline-none" bind:value={query} on:keyup={handleSearchInput} type="text">
      </div>
      
      <ul class="mt-2" bind:this={resultList}>
        {#each searchResults as s}
          <li class="result px-2 py-1 font-bold text-light dark:text-dark text-lg cursor-pointer focus:font-bold focus:bg-light-100 dark:focus:bg-dark-100 hover:bg-light-100-50 dark:hover:bg-dark-100-50 outline-none truncate" on:keydown={e => handleResultsEvent(e, s) } on:click={e => execAction(s) } tabindex="0">
            {#if s.obj.type == RESULT_TYPE.BOARD}
              <span class="rounded border border-2 px-2 uppercase text-sm mr-1 text-green-500 border-green-500 dark:text-green-300 dark:border-green-300">Board</span>
            {:else if s.obj.type == RESULT_TYPE.CARD}
              <span class="rounded border border-2 px-2 uppercase text-sm mr-1 text-red-500 border-red-500 dark:text-red-300 dark:border-red-300">Card</span>
            {/if}
            {#if s.target}
              {@html fuzzysort.highlight(s, '<span class="font-bold text-blue-400">', '</span>')}
            {:else}
              {s.obj.text}
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}