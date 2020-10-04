<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import EditableTitle from "../EditableTitle.svelte";
  import ListCard from "./ListCard.svelte";
  import ListMenu from "./ListMenu.svelte";
  import type List from "../../datastore/models/List";
  import { nimboStore } from "../../datastore/stores";

  import Sortable from "sortablejs";

  export let list: List;
  export let hasMore: boolean;

  let cardList: HTMLElement;
  let debounceScroll: number;
  let isListMenuOpen: boolean = false;

  const dispatch = createEventDispatcher();

  const handleEmit = async (e: CustomEvent): Promise<void> => {
    if (e.detail[0] === "move") {
      await $nimboStore.swapLists(list.boardId, e.detail[1]);
      $nimboStore = $nimboStore;
    } else if (e.detail[0] === "delete") {
      dispatch("delete", {
        message: "Are you sure you want to delete this list?",
        onConfirm() {
          $nimboStore.deleteList(list.boardId, list.id);
          $nimboStore = $nimboStore;
        }
      })
    }
    
    isListMenuOpen = false;
  };

  const handleListInput = async (e: KeyboardEvent): Promise<void> => {
    if (e.key == "Enter") {
      if (e.target.value) {
        await $nimboStore.addNewCard(list, e.target.value);
        $nimboStore = $nimboStore;

        scrollToBottom();
      }

      e.target.value = "";
    } else if (e.key === "l" || e.key === "/") {
      e.stopPropagation();
    }
  };

  const scrollToBottom = (): void => {
    clearTimeout(debounceScroll);
    debounceScroll = window.setTimeout(() => {
      let cards = cardList.querySelectorAll(".card");

      if (cards.length) {
        cards[cards.length - 1].scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
  };

  const updateTitle = async (e: CustomEvent): Promise<void> => {
    await $nimboStore.updateListTitle(list.boardId, list.id, e.detail);
  };

  onMount(() => {
    const sortable: any = Sortable.create(cardList, {
      group: "cardList",
      draggable: ".card-container",
      ghostClass: "card--ghost",
      chosenClass: "card--chosen",
      dragClass: "card--drag",
      onEnd: async (evt: any): Promise<void> => {
        await $nimboStore.moveCard({
          boardId: list.boardId,
          from: {
            list: evt.from.dataset.list,
            index: evt.oldDraggableIndex
          },
          to: {
            list: evt.to.dataset.list,
            index: evt.newDraggableIndex
          }
        });

        $nimboStore.boards = $nimboStore.boards;
      },
    });
  });
</script>

<style lang="postcss" global>
  .cards .card--chosen {
    @apply bg-light-100 dark:bg-black border border-2 border-dashed opacity-50;
  }
  .cards .card--drag.card--chosen {
    @apply bg-light-100 dark:bg-dark-100 border-white opacity-100;
  }
  .cards {
    min-height: 1rem;
  }
</style>

<div class="flex flex-col bg-light-200 dark:bg-dark-200 h-auto max-h-full relative w-80 rounded mr-4 text-light dark:text-dark p-2 shadow">
  <div class="flex absolute top-0 right-0 mt-3 mr-2 cursor-pointer">
    <div class="relative inline-block text-left mt-6">
      <ListMenu isOpen={isListMenuOpen} index={list.index} {hasMore} on:emit={handleEmit} />
    </div>
  </div>

  <div class="flex items-center">
    <div class="flex min-w-0 flex-grow pl-2">
      <EditableTitle
        content={list.title}
        on:updateTitle={updateTitle}
        maxLength={50} />
    </div>

    <button on:click={(e) => (isListMenuOpen = !isListMenuOpen)} type="button" class="text-light opacity-75 hover:opacity-100" aria-haspopup="true" aria-expanded="true">
      <svg
        class="w-6 h-6 mr-1"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"><circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" /></svg>
    </button>
  </div>

  <div bind:this={cardList} class="cards h-full mt-2 pr-1 overflow-y-auto" data-list={list.id}>
    {#each list.cards as c (c.id)}
      <div class="card-container bg-white hover:bg-light-100-50 dark:bg-dark-100 dark:hover:bg-dark-50 mb-2 rounded-sm">
        <ListCard {c} />
      </div>
    {/each}
  </div>

  <div class="w-full mt-2">
    <input
      on:keyup={handleListInput}
      class="bg-transparent inline-block w-full cursor-text focus:bg-white dark:focus:bg-dark-100 p-2 rounded-sm border border-transparent focus:border-white placeholder-gray-500 dark:placeholder-gray-400"
      type="text"
      placeholder="Add a card..." />
  </div>
</div>