<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";

  import Editor from "../base/Editor.svelte";
  import type nimbo from "../nimbo";
  import type { CardDetails } from '../types';

  let cardDetails: CardDetails, cd: CardDetails;
  let isConfirmModalOpen: boolean = false;
  let modalMessage: string;
  let onConfirm = () => {};

  export let id: string;
  export let isZen: boolean = false;

  const dispatch = createEventDispatcher();
  const nimboStore: Writable<nimbo> = getContext("nimbo");

  const handleCloseEvent = (): void => {
    dispatch("close"); 
  }

  const handleDeleteEvent = (e: CustomEvent): void => {
    dispatch("delete", e.detail);
  };

  const handleUpdate = async (e: CustomEvent): Promise<void> => {
    if (e.detail.card) {
      await $nimboStore.updateCard(e.detail.card, e.detail.property);
    } else if (e.detail.boardId) {
      await $nimboStore.moveCard(e.detail);
    } else {
      await $nimboStore.deleteCard(e.detail.list, e.detail.cardId);
    }

    $nimboStore.boards = $nimboStore.boards;
  }

  $: {
    cd = $nimboStore.getCardDetails(id);
        
    if (cd) {
      cardDetails = cd; 
    }
  }
</script>

<div>
  <div class="flex-none bg-light-300 inline-editor p-4 pb-8 h-auto border shadow-lg dark:bg-dark-300 overflow-y-auto rounded" 
    class:border-indigo-500={!isZen}
    class:border-transparent={isZen}
    class:mr-4={!isZen}
    class:w-116={!isZen}
    class:hidden={id == null}>
    {#if id}
      <Editor {cardDetails} inline={true} {isZen}
        on:close={handleCloseEvent}
        on:delete={handleDeleteEvent}
        on:update={handleUpdate} />
    {/if}
  </div>
</div>