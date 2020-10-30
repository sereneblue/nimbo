<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  
  import CreateBoard from "../components/CreateBoard.svelte";
  import ConfirmModal from "../components/ConfirmModal.svelte";

  import type nimbo from '../nimbo';
  import type Board from '../datastore/models/Board';
  
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

  const handleStarBoard = (boardId: string): void => {
    $nimboStore.toggleBoardStar(boardId);

    $nimboStore = $nimboStore;
  }

  $: starred = [...$nimboStore.boards].filter(b => b.isStarred).splice(0, 5);

  $: recentlyViewed = [...$nimboStore.boards].sort((a: Board, b: Board): number => {
    return b.lastViewTime - a.lastViewTime
  }).splice(0, 5);

  $: sortedBoards = [...$nimboStore.boards].sort((a: Board, b: Board): number => {
   return a.title.localeCompare(b.title);
  });
</script>

<div class="w-full min-h-screen h-full bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  <CreateBoard {isOpen} on:close={handleCloseCreateBoard} />
  <ConfirmModal {isConfirmModalOpen} {modalMessage} {onConfirm} on:close={handleCloseConfirmModal} />

  <div class="flex p-8">
    <div class="w-1/4 fixed h-full pr-2 overflow-y-auto">
      <h1 class="font-bold text-2xl">My Boards</h1>

      <div class="mt-4 mb-8">
        <h4 class="flex items-center uppercase opacity-75 text-base font-semibold leading mb-1">
          <span class="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </span>
          Starred
        </h4>
        <ul class="pr-2">
          {#each starred as s}
            <a href={"b/" + s.id} title={s.title} class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
              <div class="flex-none h-6 w-6 rounded mr-2" style={"background-color: " + s.color}></div>
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
            <a href={"b/" + r.id} title={r.title} class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
              <div class="flex-none h-6 w-6 rounded mr-2" style={"background-color: " + r.color}></div>
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
          <li title={board.title} class="p-2 w-60 h-32 text-white font-semibold text-xl rounded ml-4 mb-4 cursor-pointer" style={"background-color: " + board.color}>
            <a href={"b/" + board.id} class="flex flex-col group justify-between h-full">
              <span class="truncate-2-lines">{board.title}</span>
              <div class="flex bottom-0 pl-1">
                <div class="hidden group-hover:block">
                  <button title="Star board" on:click|preventDefault={e => handleStarBoard(board.id)} class="mr-4 transform ease-in-out hover:scale-150">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={board.isStarred ? "currentColor" : "none" } stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </button>
                  <button title="Archive board" on:click|preventDefault={e => handleArchiveBoard(board.id)} class="mr-4 transform ease-in-out hover:scale-150">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={board.isArchived ? "currentColor" : "none" } stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                  </button>
                  <button title="Delete board" on:click|preventDefault={e => handleDeleteBoard(board.id)} class="w-4 h-4 transform ease-in-out hover:scale-150">
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