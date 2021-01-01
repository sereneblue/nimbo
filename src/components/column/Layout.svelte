<script lang="ts">
  import { afterUpdate, getContext } from "svelte";
  import { flip } from "svelte/animate";

  import List from "./List.svelte";
  import ConfirmModal from "../ConfirmModal.svelte";
  import InlineEditor from "./InlineEditor.svelte";
  import type nimbo from "../../nimbo";
  import type { Board } from "../../datastore/models";

  export let boardId: string;

  let board: Board;
  let boardLists: HTMLElement;
  let isConfirmModalOpen: boolean = false;
  let modalMessage: string = "";
  let newIndex: number = null;

  let onConfirm = () => {};

  const nimboStore: Writable<nimbo> = getContext("nimbo");

  const addNewList = async (e: Event, index: number = null): Promise<void> => {
    $nimboStore.addNewList(boardId, index);
    $nimboStore = $nimboStore;

    newIndex = index === null ? board.lists.length - 1 : index + 1;
  };

  const handleCardEditEvent = (e: CustomEvent): void => {
    let inlineEditor = document.querySelector('.inline-editor');
    let list: HTMLElement = document.querySelectorAll('.list')[e.detail.listIndex];

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

  const handleCreateEvent = async (e: CustomEvent): Promise<void> => {
    await addNewList(e, e.detail);
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
    } else if (e.code === "Space" || e.key === "h") {
      e.stopPropagation();
    }
  };

  afterUpdate(() => {
    if (newIndex != null) {
      let bl: HTMLElement[] = boardLists.querySelectorAll('.editable-title span');
      bl[newIndex].focus();

      // position cursor at end of text
      if (typeof window.getSelection != "undefined"
              && typeof document.createRange != "undefined") {
        let range = document.createRange();
        range.selectNodeContents(bl[newIndex]);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (typeof document.body.createTextRange != "undefined") {
        let textRange = document.body.createTextRange();
        textRange.moveToElementText(bl[newIndex]);
        textRange.collapse(false);
        textRange.select();
      }
      
      bl[newIndex].closest('.list').scrollIntoView({
        behavior: 'smooth',
        inline: 'end'
      });

      newIndex = null;
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
        on:create={handleCreateEvent}
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