<script lang="ts">
  import { getContext } from 'svelte';
  import { slide, fly } from 'svelte/transition';
  import { push } from 'svelte-spa-router';

  import ConfirmModal from '../components/ConfirmModal.svelte';
  import InlineEditor from '../components/column/InlineEditor.svelte';
  import ListCard from '../components/column/ListCard.svelte';
  import Multiselect from '../components/zen/Multiselect.svelte';
  import type nimbo from '../nimbo';
  import type { Board, Card } from '../datastore/models';
  import { PRIORITY } from '../types';

  const nimboStore: Writable<nimbo> = getContext('nimbo');
 
  let cards: Card[] = [];
  let isConfirmModalOpen: boolean = false;
  let modalMessage: string;
  let onConfirm = () => {};
  let showFilters: boolean = false;

  const handleCloseConfirmModal = (): void => {
    isConfirmModalOpen = false;
  };

  const handleBoardFilterUpdate = async (e: CustomEvent): Promise<void> => {
    settings.selectedBoards = e.detail;

    await $nimboStore.updateSettings(settings);
    $nimboStore = $nimboStore;
  }

  const handleCardClick = (cardId: string): void => {
    $nimboStore.setSelectedCard(cardId);
    $nimboStore = $nimboStore;
  }

  const handleCloseEvent = (): void => {
    $nimboStore.setSelectedCard(null);
    $nimboStore = $nimboStore;
  }

  const handleDeleteEvent = (e: CustomEvent): void => {
    modalMessage = e.detail.message;
    isConfirmModalOpen = true;
    onConfirm = e.detail.onConfirm;
  };

  const handleFilterClick = (): void => {
    showFilters = !showFilters;
  }

  const handleKeyPress = (e: KeyboardEvent): void => {
    if (!e.target.closest('.flatpickr-calendar')) {
      if (e.key === "h") {
        $nimboStore.setSelectedCard(null);
        push("/");
      }
    }
  };

  const handleListInputBlur = async (e: FocusEvent): void => {
    settings.listFilter = e.target.value;

    await $nimboStore.updateSettings(settings);
    $nimboStore = $nimboStore;
  }

  const handleSettingsUpdate = async (key: string, value: any): void => {
    settings[key] = isNaN(parseInt(value, 10)) ? value : Number(value);

    await $nimboStore.updateSettings(settings);
    $nimboStore = $nimboStore;
  } 

  const refreshCardList = async (): Promise<void> => {
    cards = await $nimboStore.zenCards();
  }

  const updateTimeTracking = async (e: CustomEvent): Promise<void> => {
    await $nimboStore.updateCard(e.detail, "log");
    $nimboStore = $nimboStore;
  }

  $: $nimboStore && refreshCardList();
  $: settings = $nimboStore.settings;
  $: boards = $nimboStore.boards
    .filter(b => b.isArchived === false)
    .map(b => {
      return {
        name: b.title,
        value: b.id
      }
    });
</script>

<svelte:window on:keyup={handleKeyPress} />

<svelte:head>
  <title>Zen Mode | nimbo</title>
</svelte:head>

<ConfirmModal
  {isConfirmModalOpen}
  {modalMessage}
  {onConfirm}
  on:close={handleCloseConfirmModal} />

<div class="flex flex-col min-h-screen h-full justify-center max-h-full bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  <div class="flex flex-col p-3 h-full max-h-full">
    <div class="flex items-center space-x-4 m-auto">
      <div>
        <div class="flex flex-col p-3 rounded bg-light-200 dark:bg-dark-200">
          <div class="overflow-y-auto flex flex-col space-y-2 h-auto">
            {#if cards.length}
              {#each cards as c}
                <div class="card-container bg-white hover:bg-light-100-50 dark:bg-dark-100 dark:hover:bg-dark-100-50 rounded-sm w-96" on:click={e => handleCardClick(c.id)}>
                  <ListCard {c} on:trackTime={updateTimeTracking} isFocused={$nimboStore.selectedCardId === c.id} isZen />
                </div>
              {/each}
            {:else}
              <div class="w-96">
                No cards to display.
              </div>
            {/if}
          </div>
        </div>
        <div class="flex justify-end text-2xl my-1">
          <button on:click={handleFilterClick} class="flex items-center py-1 px-2 rounded text-sm border border-transparent text-indigo-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span class="ml-2">Filter</span>
          </button>
        </div>
        {#if showFilters}
          <div transition:slide class="flex flex-col space-y-4 p-3 border-t border-indigo-500 text-light dark:text-dark my-2">
            <div class="w-96 space-y-2">
              <div class="block">
                <span>Boards</span>
                <Multiselect options={boards} selected={settings.selectedBoards} on:update={handleBoardFilterUpdate} />
              </div>
              <div class="block">
                <span>Lists</span>
                <input
                  class="bg-white dark:bg-dark-200 inline-block w-full focus:bg-white dark:focus:bg-dark-100 p-1.5 mt-1 rounded-sm border border-transparent focus:border-indigo-500 placeholder-light dark:placeholder-dark"
                  type="text"
                  on:blur={handleListInputBlur}
                  on:keyup|stopPropagation
                  placeholder="Ex. 'pending,todo' etc" />
              </div>
              <label class="block">
                <span>Due Date</span>
                <select class="form-select p-1.5 mt-1 bg-white dark:bg-dark-200 border border-light-200 dark:border-transparent w-full" on:change={e => handleSettingsUpdate('dueFilter', e.target.value)} value={settings.dueFilter}>
                  <option value="all">All</option>
                  <option value="overdue">Overdue</option>
                  <option value="tomorrow">Due in the next day</option>
                  <option value="week">Due in the next week</option>
                  <option value="month">Due in the next month</option>
                </select>
              </label>
              <label class="block">
                <span>Max cards to display</span>
                <select class="form-select p-1.5 mt-1 bg-white dark:bg-dark-200 border border-light-200 dark:border-transparent w-full" on:change={e => handleSettingsUpdate('maxCards', e.target.value)} value={settings.maxCards}>
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                </select>
              </label>
            </div>
          </div>
        {/if}
      </div>
      {#if $nimboStore.selectedCardId}
        <div transition:fly="{{ x: -100 }}" class="min-h-0 overflow-y-auto max-h-160 w-116">
          <InlineEditor isZen id={$nimboStore.selectedCardId} on:delete={handleDeleteEvent} on:close={handleCloseEvent} />
        </div>
      {/if}
    </div>
  </div>
</div>