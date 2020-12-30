<script lang="ts">
  import { getContext } from "svelte";
  import { link } from "svelte-spa-router";

  import Editor from "../components/base/Editor.svelte";
  import ConfirmModal from "../components/ConfirmModal.svelte";
  import type nimbo from "../nimbo";
  import type { CardDetails } from "../types";

  export let params = {};

  let cardDetails: CardDetails, cd: CardDetails;
  let isConfirmModalOpen: boolean = false;
  let modalMessage: string;
  let onConfirm = () => {};
  let title: string;

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
    cd = $nimboStore.getCardDetails(params.cardId);
    
    if (cd) {
      cardDetails = cd; 
    }
  }

  $: {
    title = cardDetails ?  cardDetails.card.title + " | nimbo" : "Card not found | nimbo";
  }
</script>

<ConfirmModal
  {isConfirmModalOpen}
  {modalMessage}
  {onConfirm}
  on:close={handleCloseConfirmModal} />

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="min-h-screen h-full bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  <div class="w-3/4 py-8 mx-auto">
    {#if cardDetails}
      <Editor {cardDetails} inline={false} on:update={handleUpdate} on:delete={handleDeleteEvent} />
    {:else}
      <div class="flex flex-col p-3 max-h-full">
        <div class="text-center text-2xl mt-6">
          ¯\_(ツ)_/¯
        </div>
        <h1 class="text-center font-bold text-2xl mt-2 mb-4">Card not found</h1>
        <a class="link text-center text-lg" href="/" use:link>Go to home</a>
      </div>
    {/if}
  </div>
</div>