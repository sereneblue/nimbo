<script lang="ts">
  import { getContext } from "svelte";
  import { flip } from "svelte/animate";

  import List from "./List.svelte";
  import ConfirmModal from "../ConfirmModal.svelte";
  import type nimbo from "../../nimbo";

  export let boardId: string;

  let isConfirmModalOpen: boolean = false;
  let modalMessage: string;
  let onConfirm = () => {};

  const nimboStore: Writable<nimbo> = getContext("nimbo");

  const addNewList = async (): Promise<void> => {
    $nimboStore.addNewList(boardId);
    $nimboStore = $nimboStore;
  };

  const handleCloseConfirmModal = (): void => {
    isConfirmModalOpen = false;
  };

  const handleDeleteEvent = (e: CustomEvent): void => {
    modalMessage = e.detail.message;
    isConfirmModalOpen = true;
    onConfirm = e.detail.onConfirm;
  };

  const handleKeyPress = async (e: KeyboardEvent): Promise<void> => {
    if (e.key === "l") {
      await addNewList();
      e.stopPropagation();
    } else if (e.key === "/") {
      e.stopPropagation();
    }
  };

  $: board = $nimboStore.getBoard(boardId);
</script>

<svelte:window on:keyup={handleKeyPress} />

<ConfirmModal
  {isConfirmModalOpen}
  {modalMessage}
  {onConfirm}
  on:close={handleCloseConfirmModal} />

<div class="flex max-h-full w-full pb-2 overflow-x-auto">
  {#each board.lists as l (l.id)}
    <div animate:flip={{ duration: 300 }}>
      <List
        list={l}
        hasMore={l.index < board.lists.length}
        on:delete={handleDeleteEvent} />
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