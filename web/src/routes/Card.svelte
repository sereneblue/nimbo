<script lang="ts">
  import { getContext } from "svelte";

  import Editor from "../components/base/Editor.svelte";
  import ConfirmModal from "../components/ConfirmModal.svelte";
  import type nimbo from "../nimbo";
  import type { CardDetails } from '../types';

  export let id: string;

  let cardDetails: CardDetails, cd: CardDetails;
  let isConfirmModalOpen: boolean = false;
  let modalMessage: string;
  let onConfirm = () => {};

  const nimboStore: Writable<nimbo> = getContext("nimbo");
  
  const handleUpdate = async (e: CustomEvent): Promise<void> => {
    if (e.detail.card) {
      await $nimboStore.updateCard(e.detail.card, e.detail.property);
    } else {
      await $nimboStore.deleteCard(e.detail.list, e.detail.cardId);
    }

    $nimboStore = $nimboStore;
  }

  const handleCloseConfirmModal = (): void => {
    isConfirmModalOpen = false;
  };

  const handleDeleteEvent = async (e: CustomEvent): Promise<void> => {
    modalMessage = e.detail.message;
    isConfirmModalOpen = true;
    onConfirm = e.detail.onConfirm;
  };

  $: {
    cd = $nimboStore.getCardDetails(id);
    
    if (cd) {
      cardDetails = cd; 
    }
  }
</script>

<ConfirmModal
  {isConfirmModalOpen}
  {modalMessage}
  {onConfirm}
  on:close={handleCloseConfirmModal} />

<div class="min-h-screen h-full bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  <div class="w-3/4 py-8 mx-auto">
    <Editor {cardDetails} inline={false} on:update={handleUpdate} on:delete={handleDeleteEvent} />
  </div>
</div>