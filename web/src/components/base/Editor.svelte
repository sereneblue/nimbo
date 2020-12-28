<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { link } from "svelte-spa-router";
  import { formatDate, formatTime } from '../../util'; 
  import EditableTitle from '../EditableTitle.svelte';
  import CardDue from '../card/CardDue.svelte';
  import CardLabel from '../card/CardLabel.svelte';
  import CardPriority from '../card/CardPriority.svelte';
  import type { CardDetails } from '../../types';

  import Sortable from "sortablejs";
  import DOMPurify from 'dompurify';
  import marked from 'marked';
  import parse from 'parse-duration';

  export let cardDetails: CardDetails;
  export let inline: boolean;

  let boardLink: HTMLAnchorElement;
  let bufferDescription: string;
  let cardDescription: string = cardDetails.card.description;
  let checklist: HTMLElement;
  let editDescription: boolean = false;
  let hideCompleted: boolean = false;

  const dispatch = createEventDispatcher();
  const renderer = new marked.Renderer();

  renderer.link = function(href, title, text) {
    return marked.Renderer.prototype.link.apply(this, arguments).replace("<a","<a class='link' target='_blank'");
  };

  marked.setOptions({
      renderer: renderer
  });

  DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if ('target' in node) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener');
    }
  });

  const handleChecklistDelete = (e: Event): void => {    
    cardDetails.card.deleteFromChecklist(Number(e.target.dataset.index));
    cardDetails.card = cardDetails.card;
    
    dispatch("update", {
      card: cardDetails.card,
      property: "checklist"
    });
  }

  const handleChecklistClick = (e: Event): void => {
    dispatch("update", {
      card: cardDetails.card,
      property: "checklist"
    });
  }

  const handleChecklistInput = (e: KeyboardEvent): void => {
    if (e.target.value && e.key === "Enter") {
      let checklistItems: string[] = e.target.value.split('\n').filter(item => item.trim() != "");

      for (let i: number = 0; i < checklistItems.length; i++) {
        cardDetails.card.addToChecklist(checklistItems[i]);
      }

      dispatch("update", {
        card: cardDetails.card,
        property: "checklist"
      });

      cardDetails.card = cardDetails.card;
      e.preventDefault();
      e.target.value = "";
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.target.value = "";
    }
  }

  const handleCloseClick = (): void => {
    dispatch("close");
  }

  const handleDateUpdate = (e: Event): void => {
    cardDetails.card.setDueDate(e.detail);

    dispatch("update", {
      card: cardDetails.card,
      property: "due"
    });

    cardDetails.card = cardDetails.card;
  }

  const handleDeleteChecklist = (e: Event): void => {
    dispatch("delete", {
      message: "Are you sure you want to delete this checklist?",
      onConfirm: () => {
        cardDetails.card.checklist = [];

        dispatch("update", {
          card: cardDetails.card,
          property: "checklist"
        });
      }
    });
  }

  const handleDeleteCard = (e: Event): void => {
    dispatch("delete", {
      message: "Are you sure you want to delete this card?",
      onConfirm: () => {
        dispatch("update", {
          list: cardDetails.list,
          cardId: cardDetails.card.id
        });

        if (inline) {
          dispatch("close");
        } else {
          boardLink.click();
        }
      }
    });
  }

  const handleDescriptionClick = (e: Event): void => {
    if (editDescription) {
      cardDetails.card.description = description;

      dispatch("update", {
        card: cardDetails.card,
        property: "description"
      });
    }

    editDescription = !editDescription;
  }

  const handleDueComplete = (e: Event): void => {
    cardDetails.card.setComplete(e.detail);

    dispatch("update", {
      card: cardDetails.card,
      property: "isComplete"
    })
  }

  const handleLabelUpdate = (e: Event): void => {
    cardDetails.card.setLabel(e.detail);

    dispatch("update", {
      card: cardDetails.card,
      property: "label"
    })
  }

  const handlePriorityUpdate = (e: Event): void => {
    cardDetails.card.setPriority(e.detail);

    dispatch("update", {
      card: cardDetails.card,
      property: "priority"
    });

    cardDetails.card = cardDetails.card;
  }
  
  const handleToggleHideCompleted = (e: Event): void => {
    hideCompleted = !hideCompleted;
  }

  const handleTimeLogDelete = (e: Event): void => {
    dispatch("delete", {
      message: "Are you sure you want to delete this time entry?",
      onConfirm: () => {
        cardDetails.card.deleteTimeEntry(Number(e.target.dataset.index));
        cardDetails.card = cardDetails.card;

        dispatch("update", {
          card: cardDetails.card,
          property: "log"
        });
      }
    });
  }

  const handleTimeTrackingInput = (e: Event): void => {
    if (e.target.value && e.key === "Enter") {
      let duration: number | null = parse(e.target.value, "s");

      if (duration) {
        cardDetails.card.trackTime(duration);

        dispatch("update", {
          card: cardDetails.card,
          property: "log"
        })

        cardDetails.card = cardDetails.card;
        e.target.value = "";
      }
    }
  }

  const updateTitle = (e: CustomEvent): void => {
    cardDetails.card.title = e.detail;

    dispatch("update", {
      card: cardDetails.card,
      property: "title"
    })
  }

  onMount(() => {
    const sortable: any = Sortable.create(checklist, {
      group: "checklistItems",
      draggable: ".checklist__item",
      ghostClass: "checklist__item--ghost",
      chosenClass: "checklist__item--chosen",
      dragClass: "checklist__item--drag",
      onEnd: (evt: any): void => {
        if (evt.oldDraggableIndex != evt.newDraggableIndex) {
          cardDetails.card.checklist.splice(evt.newDraggableIndex, 0, cardDetails.card.checklist.splice(evt.oldDraggableIndex, 1)[0]);
        }

        dispatch("update", {
          card: cardDetails.card,
          property: "checklist"
        });
      },
    });
  });

  $: checklistProgress = cardDetails.card.checklist.length === 0 ? 
      "" :
      Math.round( (cardDetails.card.checklist.filter(c => c.checked).length / cardDetails.card.checklist.length) * 100 ) + "%";

  $: totalTime = cardDetails.card.log.reduce((a, b) => { return a + b.duration}, 0);
</script>

<style lang="postcss">
  .checklist__item--chosen {
    @apply bg-light-100 dark:bg-black border border-2 border-dashed opacity-50;
  }
  .checklist__item--drag.checklist__item--chosen {
    @apply bg-light-100 dark:bg-dark-100 border-white opacity-100;
  }
</style>

<div class="{inline ? 'w-96' : 'w-4/5 mx-auto'}">
  <div class="mb-2">
    {#if !inline}
      <div class="flex items-center">
        <div class="w-6 h-6 mr-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path></svg>
        </div>
        <div class="text-lg">
          <a bind:this={boardLink} class="link" use:link={"/b/" + cardDetails.board.id}>
            {cardDetails.board.title}
          </a>
          <span class="">/</span>
          <span class="">
            {cardDetails.list.title}
          </span>
        </div>
      </div>
    {/if}
    <div class="relative text-2xl font-semibold mt-1" class:ml-8={!inline}>
      {#if inline}
        <div class="flex flex-col space-y-4 absolute w-8 h-8 top-0 right-0 -mr-10">
          <div class="relative cursor-pointer opacity-75 hover:opacity-100" title="Close" on:click={handleCloseClick}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <a href={"#/c/" + cardDetails.card.id} target="_blank" class="link relative opacity-75 hover:opacity-100" title="Open in new tab">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>
      {/if}
      <EditableTitle content={cardDetails.card.title} on:updateTitle={updateTitle} isTitle />
    </div>
  </div>


  <div class="mb-2">
    <div class="flex items-center">
      <div class:ml-8={!inline}>
        <h3 class="text-xl dark:opacity-75">
          Description
        </h3>
      </div>
      {#if editDescription || cardDetails.card.description }
        <div>
          <button on:click={handleDescriptionClick} class="ml-2 text-base underline dark:opacity-50 dark:hover:opacity-75"  >{editDescription ? "Save" : "Edit"}</button>
        </div>
      {/if}
    </div>    
    <div class="mt-2 text-lg" class:ml-8={!inline}>
      {#if cardDetails.card.description && !editDescription}
        <div class="rounded-sm px-1 break-words">
          {@html DOMPurify.sanitize(marked(cardDetails.card.description))}
        </div>
      {:else}
        {#if editDescription}
          <textarea bind:value={cardDescription} on:keyup|stopPropagation class="w-full bg-white border-light-200 border-2 dark:border-transparent dark:bg-dark-100 p-1 rounded placeholder-dark-200 dark:placeholder-gray-400 shadow-sm" placeholder="Add a description" rows="10"></textarea>
        {:else}
          <div class="opacity-75 hover:opacity-100 underline cursor-pointer" on:click={handleDescriptionClick}>Add a description</div>
        {/if}
      {/if}
    </div>
  </div>

  <div class="flex mb-2" class:flex-col={inline} class:space-y-1={inline}>
    <div>
      <div class="flex items-center">
        <div class:ml-8={!inline}>
          <h3 class="text-xl dark:opacity-75">
            Due Date
          </h3>
        </div>
      </div>    
      <div class="flex mt-2 text-lg" class:ml-8={!inline}>
        <CardDue date={cardDetails.card.due} complete={cardDetails.card.isComplete} on:complete={handleDueComplete} on:update={handleDateUpdate} />
      </div>
    </div>
    <div>
      <div class="flex items-center">
        <div class:ml-8={!inline}>
          <h3 class="text-xl opacity-75">
            Priority
          </h3>
        </div>
      </div>
      <div class="flex mt-2 text-lg" class:ml-8={!inline}>
        <CardPriority selectedPriority={cardDetails.card.priority} on:update={handlePriorityUpdate} />
      </div>
    </div>
    <div>
      <div class="flex items-center">
        <div class:ml-8={!inline}>
          <h3 class="text-xl opacity-75">
            Label
          </h3>
        </div>
      </div>    
      <div class="flex mt-2 text-lg" class:ml-8={!inline}>
        <CardLabel on:update={handleLabelUpdate} selected={cardDetails.card.label} labels={cardDetails.board.labels} />
      </div>
    </div>
  </div>

  <div class="mb-2">
    <div class="flex items-center">
      {#if !inline}
        <div class="w-6 h-6 mr-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </div>
      {/if}
      <div class="w-full">
        <h3 class="flex items-center w-full justify-between text-2xl font-bold">
          <span>
            Checklist
            <span class="ml-1 opacity-75 text-base">{checklistProgress}</span>
          </span>
          {#if cardDetails.card.checklist.length}
            <span>
              <button on:click={handleToggleHideCompleted} class="ml-2 text-base underline opacity-75">
                {#if hideCompleted}
                  Show completed
                {:else}
                  Hide completed
                {/if}
              </button>
              <button on:click={handleDeleteChecklist} class="ml-2 text-base underline opacity-75">Delete all</button>
            </span>
          {/if}
        </h3>
      </div>
    </div>
    <div class="mt-2">
      {#if cardDetails.card.checklist.length}
        <div class="rounded-full w-full h-2 bg-light-100 shadow-sm dark:bg-dark-200 mb-2" class:ml-8={!inline}>
          <div class="rounded-full w-1/2 bg-indigo-500 h-2 transition-all duration-200 ease-in-out" style={'width:' + checklistProgress }></div>
        </div>
      {/if}
      <ul bind:this={checklist} class="ml-1 -mr-8">
        {#each cardDetails.card.checklist as cl, index (cl)}
          {#if (hideCompleted && !cl.checked) || hideCompleted == false }
            <li class="checklist__item group relative flex mt-1 mr-1 p-1 rounded hover:bg-light-200 dark:hover:bg-dark-200">
              <label class="flex items-center cursor-pointer w-full" class:opacity-50={cl.checked}>
                <input bind:checked={cl.checked} on:click={handleChecklistClick} type="checkbox" class="form-checkbox text-indigo-500 h-4 w-4 border-2 dark:border">
                <span class="ml-2 text-lg" class:line-through={cl.checked} class:italic={cl.checked} class:opacity-75={cl.checked}>{cl.text}</span>
              </label>
              <div on:click={handleChecklistDelete} data-index={index} class="absolute top-0 right-0 p-2 opacity-100 cursor-pointer hidden group-hover:block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
            </li>
          {/if}
        {/each}
      </ul>
      <div class="mt-1" class:ml-8={!inline}>
        <textarea
        on:keydown={handleChecklistInput}
        on:keyup|stopPropagation
        class="bg-transparent text-base inline-block w-full p-1 rounded-sm placeholder-dark-200 dark:placeholder-gray-500 border border-transparent focus:border-indigo-500"
        type="text" placeholder="Add an item to checklist"></textarea>
      </div>
    </div>
  </div>

  <div class="mb-2">
    <div class="flex items-center">
      {#if !inline}
        <div class="w-6 h-6 mr-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
      {/if}
      <div class="w-full">
        <h3 class="flex items-center w-full justify-between text-2xl font-bold">
          <span>
            Time Tracking
            <span class="ml-1 opacity-75 text-base">{formatTime(totalTime)}</span>
          </span>
        </h3>
      </div>
    </div>
    <div class="mt-2">
      <ul class="-mr-8" class:ml-8={!inline}>
        {#each cardDetails.card.log as l, index (l)}
          <li class="timetrack__item group flex mt-1 -ml-1 p-1 items-center rounded hover:bg-light-200 dark:hover:bg-dark-200">
            <div class="flex-grow ml-1">
              <div class="text-xl font-semibold">{formatTime(l.duration)}</div>
              <div class="-mt-1 opacity-75">{formatDate(l.date)}</div>
            </div>
            <div on:click={handleTimeLogDelete} data-index={index} class="p-2 opacity-100 cursor-pointer hidden group-hover:block">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
          </li>
        {/each}
      </ul>
      <div class="mt-1" class:ml-8={!inline}>
        <input
        on:keydown={handleTimeTrackingInput}
        on:keyup|stopPropagation
        class="bg-transparent text-base inline-block w-full p-1 rounded-sm placeholder-dark-200 dark:placeholder-gray-500 border border-transparent focus:border-indigo-500"
        type="text" placeholder="Add a duration. ex. 30m">
      </div>
    </div>
  </div>

  <div class="my-6" class:ml-8={!inline}>
    <button on:click={handleDeleteCard} class="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-1 px-2 rounded">
      Delete card
    </button>
  </div>
</div>