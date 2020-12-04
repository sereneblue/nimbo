<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { push } from 'svelte-spa-router';
  import { saveAs } from 'file-saver';

  import CreateBoard from "../components/CreateBoard.svelte";
  import ConfirmModal from "../components/ConfirmModal.svelte";
  import { BOARD_COLORS } from '../types';

  import type nimbo from '../nimbo';
  import type Board from '../datastore/models/Board';
  
  let hideArchivedBoards: boolean = true;
  let importedDB: FileList;
  let isOpen: boolean = false;
  let isConfirmModalOpen: boolean = false;
  let modalMessage: string;
  let onConfirm: Function;

  const nimboStore: Writable<nimbo> = getContext('nimbo');

  const handleArchiveBoard = (boardId: string): void => {
    $nimboStore.toggleBoardArchive(boardId);

    $nimboStore = $nimboStore;
  }

  const handleOpenCreateBoard = (e: Event): void => {
    isOpen = true;
  }

  const handleCloseCreateBoard = (e: Event): void => {
    isOpen = false;
  }

  const handleCloseConfirmModal = (e: Event): void => {
    isConfirmModalOpen = false;
  }

  const handleDeleteBoard = (boardId: string): void => {
    onConfirm = async () => {
      await $nimboStore.deleteBoard(boardId);

      $nimboStore = $nimboStore;
    }

    modalMessage = "Are you sure you want to delete this board?";
    isConfirmModalOpen = true;
  }

  const handleExportBoards = async (): Promise<void> => {
    let boards: Blob = await $nimboStore.export();

    saveAs(boards, `nimbo_${new Date().getTime()}.db`);
  }

  const handleImportBoards = async (e: Event): void => {
    let ok: boolean = await $nimboStore.import(importedDB[0]);

    if (ok) {
      window.location.reload();
    }
  }

  const handleImportClick = (): void => {
    document.querySelector('#import').click();
  }

  const handleStarBoard = (boardId: string): void => {
    $nimboStore.toggleBoardStar(boardId);

    $nimboStore = $nimboStore;
  }

  const handleToggleArchivedBoards = (): void => {
    hideArchivedBoards = !hideArchivedBoards;
  }

  const handleToggleTheme = (): void => {
    $nimboStore.toggleTheme();

    $nimboStore = $nimboStore;
  }

  $: starred = [...$nimboStore.boards].filter(b => b.isStarred).splice(0, 5);

  $: recentlyViewed = [...$nimboStore.boards].sort((a: Board, b: Board): number => {
    return b.lastViewTime - a.lastViewTime
  }).splice(0, 5);

  $: sortedBoards = [...$nimboStore.boards].filter(b => !b.isArchived || !hideArchivedBoards).sort((a: Board, b: Board): number => {
   return a.title.localeCompare(b.title);
  });

  $: importedDB && handleImportBoards();
</script>

<svelte:head>
  <title>My Boards | nimbo</title>
</svelte:head>

<div class="w-full min-h-screen h-full bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  <CreateBoard {isOpen} on:close={handleCloseCreateBoard} />
  <ConfirmModal {isConfirmModalOpen} {modalMessage} {onConfirm} on:close={handleCloseConfirmModal} />

  <div class="flex p-8">
    <div class="w-1/4 fixed h-full pr-2 overflow-y-auto">
      <h1 class="font-bold text-2xl">My Boards</h1>
      <button class="opacity-75 hover:opacity-100 ml-0.5" on:click={handleToggleArchivedBoards}>
        {#if hideArchivedBoards}
          Show archived boards
        {:else}
          Hide archived boards
        {/if}
      </button>
      <div class="flex my-3">
        <input id="import" class="hidden" bind:files={importedDB} type="file" />
        <div>
          <button on:click={handleToggleTheme} class="flex items-center py-1 px-2 rounded text-sm border border-transparent bg-indigo-500 text-white hover:bg-indigo-600 mr-2">
           {#if $nimboStore.theme === 'light'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              Light
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                Dark
            {/if}
          </button>
        </div>
        <button on:click={handleImportClick} class="flex items-center py-1 px-2 rounded text-sm border border-indigo-500 text-light dark:text-dark hover:bg-indigo-600 hover:text-white dark:hover:text-white mr-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Import
        </button>
        <button on:click={handleExportBoards} class="flex items-center py-1 px-2 rounded text-sm border border-indigo-500 text-light dark:text-dark hover:bg-indigo-600 hover:text-white dark:hover:text-white mr-2"> 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export
        </button>
      </div>

      <div class="mt-4 mb-8">
        <h4 class="flex items-center uppercase opacity-75 text-base font-semibold leading mb-1">
          <span class="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </span>
          Starred
        </h4>
        <ul class="pr-2">
          {#each starred as s}
            <a on:click={push("/b/" + s.id)} title={s.title} class="block flex hover:bg-light-100 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
                <div class="flex-none h-6 w-6 rounded mr-2" style={"background-color: " + BOARD_COLORS[s.color]}></div>
              <span class="truncate">{s.title}</span>
            </a>
          {/each}
        </ul>
      </div>
      <div>
        <h4 class="flex items-center uppercase opacity-75 text-base font-semibold leading mb-1">
          <span class="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </span>
          Recently Viewed
        </h4>
        <ul class="pr-2">
          {#each recentlyViewed as r}
            <a on:click={push("/b/" + r.id)} title={r.title} class="block flex hover:bg-light-100 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
              <div class="flex-none h-6 w-6 rounded mr-2" style={"background-color: " + BOARD_COLORS[r.color]}></div>
              <span class="truncate">{r.title}</span>
            </a>
          {/each}
        </ul>
      </div>
    </div>
    <div class="w-3/4 h-full" style="margin-left: 25%">
      <ul class="flex flex-wrap max-w-6xl w-full">
        <li on:click={handleOpenCreateBoard} class="p-2 w-60 h-32 opacity-50 hover:opacity-75 flex flex-col justify-center border border-dashed border-light dark:border-dark font-semibold text-xl text-center text-light dark:text-dark rounded ml-4 mb-3 cursor-pointer" tabindex="0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create a board
        </li>
        {#each sortedBoards as board (board.id)}
          <li title={board.title} class="p-2 w-60 h-32 overflow-hidden text-white font-semibold text-xl rounded ml-4 mb-4 cursor-pointer" style={"background-color: " + BOARD_COLORS[board.color]}>
            <a on:click={e => push('/b/' + board.id)}  class="flex flex-col relative group justify-between h-full">
              {#if board.isArchived}
                <div class="absolute bg-indigo-500 mt-2 w-28 -mr-10 text-center top-0 right-0 transform rotate-45 text-white text-xs">Archived</div>
              {/if}
              <span class="truncate-2-lines">{board.title}</span>
              <div class="flex bottom-0 pl-1">
                {#if board.isStarred}
                  <div class="block group-hover:hidden">
                    <button on:click|stopPropagation={e => handleStarBoard(board.id)} class="mr-4 transform ease-in-out hover:scale-150">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </button>
                  </div>
                {/if}
                <div class="hidden group-hover:block">
                  <button title="Star board" on:click|stopPropagation={e => handleStarBoard(board.id)} class="mr-4 transform ease-in-out hover:scale-150">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={board.isStarred ? "currentColor" : "none" } stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </button>
                  <button title="Archive board" on:click|stopPropagation={e => handleArchiveBoard(board.id)} class="mr-4 transform ease-in-out hover:scale-150">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={board.isArchived ? "currentColor" : "none" } stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                  </button>
                  <button title="Delete board" on:click|stopPropagation={e => handleDeleteBoard(board.id)} class="w-4 h-4 transform ease-in-out hover:scale-150">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>