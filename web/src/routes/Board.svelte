<script lang="ts">
  import { getContext } from 'svelte';

  import ColumnLayout from '../components/column/Layout.svelte';
  import EditableTitle from '../components/EditableTitle.svelte';
  import InlineEditor from '../components/column/InlineEditor.svelte';
  import BoardLabel from '../components/BoardLabel.svelte';
  import SearchPalette from "../components/SearchPalette.svelte";

  import type nimbo from '../nimbo';

  export let id: string;

  let title: string;
  const nimboStore: Writable<nimbo> = getContext('nimbo');
  
  const updateTitle = async (e: CustomEvent): Promise<void> => {
    $nimboStore.updateBoardTitle($nimboStore.boards[boardIndex].id, e.detail) 
  }

  const updateLabels = async (e: CustomEvent): Promise<void> => {
    $nimboStore.updateLabels($nimboStore.boards[boardIndex].id, e.detail) 
  }

  let boardIndex: number;

  $: { 
    boardIndex = $nimboStore.boards.findIndex(b => b.id === id);  

    if (boardIndex > -1) {
      $nimboStore.updateViewTime($nimboStore.boards[boardIndex].id);
    }
  }

  $: {
    title = boardIndex > -1 ?  $nimboStore.boards[boardIndex].title + " | nimbo" : "Board not found | nimbo";
  }

  const handleKeyPress = (e: KeyboardEvent): void => {
    if (e.key === "/") {
      $nimboStore.openPalette();
      $nimboStore = $nimboStore;
    }
  };
</script>

<svelte:window on:keyup={handleKeyPress} />

<SearchPalette />

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="flex flex-col min-h-screen max-h-full h-screen overflow-hidden bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  {#if boardIndex > -1}
    <div class="flex flex-col p-3 max-h-full">
      <div class="mb-1">
        <EditableTitle content={$nimboStore.boards[boardIndex].title} on:updateTitle={updateTitle} isTitle />
      </div>

      <div class="flex space-x-2">
        <BoardLabel on:update={updateLabels} labels={$nimboStore.boards[boardIndex].labels} />
      </div>
    
      <div class="flex flex-col min-h-0 max-h-full w-full mt-2">
        <ColumnLayout boardId={$nimboStore.boards[boardIndex].id} />
      </div>
    </div>
  {:else}
    <div class="flex flex-col p-3 max-h-full">
      <div class="text-center text-2xl mt-6">
        ¯\_(ツ)_/¯
      </div>
      <h1 class="text-center font-bold text-2xl mt-2 mb-4">Board not found</h1>
      <a class="link text-center text-lg" href="/">View all boards</a>
    </div>
  {/if}
</div>