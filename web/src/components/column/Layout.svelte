<script lang="ts">
  import { afterUpdate, getContext } from "svelte";
  import { flip } from "svelte/animate";

  import List from "./List.svelte";
  import ConfirmModal from "../ConfirmModal.svelte";
  import InlineEditor from "./InlineEditor.svelte";
  import type nimbo from "../../nimbo";
  import type { Board } from "../../datastore/models/Board";

  export let boardId: string;

  let board: Board;
  let boardLists: HTMLElement;
  let isConfirmModalOpen: boolean = false;
  let hasNewList: boolean = false;;
  let modalMessage: string;

  let onConfirm = () => {};

  const nimboStore: Writable<nimbo> = getContext("nimbo");

  const addNewList = async (): Promise<void> => {
    $nimboStore.addNewList(boardId);
    $nimboStore = $nimboStore;

    hasNewList = true;
  };

  const handleCardEditEvent = (e: CustomEvent): void => {
    let inlineEditor = document.querySelector('.inline-editor');
    let list: HTMLElement = document.querySelectorAll('.list')[e.detail.listIndex - 1];

    list.parentNode.after(inlineEditor);

    $nimboStore.setSelectedCard(e.detail.cardId);
    $nimboStore = $nimboStore;
  }

  const handleCloseConfirmModal = (): void => {
    isConfirmModalOpen = false;
  };

  const handleCloseEvent = (): void => {
    $nimboStore.setSelectedCard(null);
    $nimboStore = $nimboStore;
  }

  const handleDeleteEvent = (e: CustomEvent): void => {
    modalMessage = e.detail.message;
    isConfirmModalOpen = true;
    onConfirm = e.detail.onConfirm;
  };

  const handleKeyPress = async (e: KeyboardEvent): Promise<void> => {
    if (e.key === "l" && $nimboStore.selectedCardId === null) {
      await addNewList();
      e.stopPropagation();
    } else if (e.key === "/") {
      e.stopPropagation();
    } else if (e.key === "h") {
      e.stopPropagation();
    }
  };

  afterUpdate(() => {
    if (hasNewList) {
      let bl: HTMLElement[] = boardLists.querySelectorAll('.editable-title span');
      bl[bl.length - 1].focus();

      // position cursor at end of text
      if (typeof window.getSelection != "undefined"
              && typeof document.createRange != "undefined") {
        let range = document.createRange();
        range.selectNodeContents(bl[bl.length - 1]);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (typeof document.body.createTextRange != "undefined") {
        let textRange = document.body.createTextRange();
        textRange.moveToElementText(bl[bl.length - 1]);
        textRange.collapse(false);
        textRange.select();
      }
      
      bl[bl.length - 1].closest('.list').scrollIntoView({
        behavior: 'smooth',
        inline: 'end'
      });
      hasNewList = false;
    }
  });

  $: board = $nimboStore.getBoard(boardId);
</script>

<svelte:window on:keyup={handleKeyPress} />

<ConfirmModal
  {isConfirmModalOpen}
  {modalMessage}
  {onConfirm}
  on:close={handleCloseConfirmModal} />

<div bind:this={boardLists} class="flex max-h-full w-full pb-2 overflow-x-auto">
  <InlineEditor id={$nimboStore.selectedCardId} on:delete={handleDeleteEvent} on:close={handleCloseEvent} />

  {#each board.lists as l (l.id)}
    <div animate:flip={{ duration: 300 }}>
      <List
        list={l}
        hasMore={l.index < board.lists.length}
        on:delete={handleDeleteEvent}
        on:cardEdit={handleCardEditEvent} />
    </div>
  {/each}
  <div>
    <button
      on:click={addNewList}
      class="rounded py-2 w-80 text-center border border-dashed border-gray-700
        focus:outline-none opacity-50 hover:opacity-75 min-h-0 h-auto">
      Press <b>l</b> to add new list or click here
    </button>
  </div>
</div>