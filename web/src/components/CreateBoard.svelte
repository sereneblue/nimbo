<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { navigate } from 'svelte-routing';

  import Modal from './base/Modal.svelte';
  import type nimbo from '../nimbo';
  
  export let isOpen: boolean;
  
  let boardTitle: string = "";

  const dispatch = createEventDispatcher();
  const nimboStore: Writable<nimbo> = getContext("nimbo");

  const handleInput = (e: KeyboardEvent): void => {
    if (e.key == "Enter") {
      handleCreateBoard(e);
    }
  }

  const handleClose = (e: CustomEvent): void => {
    dispatch("close");
  }

  const handleCreateBoard = async (e: Event): Promise<void> => {
    e.preventDefault();

    if (boardTitle) {
      let boardId: string = await $nimboStore.createBoard(boardTitle);
  
      $nimboStore.boards = $nimboStore.boards;
  
      navigate("b/" + boardId);
    }
  }

  const init = () => {
    const boardInput: HTMLInputElement = document.querySelector('#newBoardInput');
    boardInput.value = "";
    boardInput.focus();
  };
</script> 

<Modal {isOpen} on:close={handleClose}>
  <div class="p-4" use:init>
    <form on:submit={handleCreateBoard}>
      <input id="newBoardInput" title="Please enter a valid board name" autocomplete="off" pattern=".*\S+.*" class="text-light dark:text-dark text-2xl pl-2 pr-2 py-2 w-full bg-light-300 dark:bg-dark-300 border border-transparent focus:border-indigo-500 appearance-none leading-normal rounded outline-none" placeholder="Board name" bind:value={boardTitle} on:keydown={handleInput} required type="text">

      <button type="submit" class="mt-4 bg-indigo-600 w-full hover:bg-indigo-700 text-white text-xl font-bold py-2 px-4 rounded">
        Create board
      </button>
    </form>
  </div>
</Modal>