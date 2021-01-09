<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { Card } from '../../datastore/models';
  import { PRIORITY, LABEL_COLOR } from '../../types';
  import type { TimeEntry } from '../../types';
  import { beforeDate, formatDate, formatForStopwatch, formatTime } from '../../util';
  
  export let c: Card;
  export let isFocused: boolean = false;
  export let isZen: boolean = false;

  const dispatch = createEventDispatcher();

  let seconds: number = 0;
  let stopwatchInterval: number;
  let stopwatchStarted: boolean = false;

  const handleStopwatchStart = (e: Event): void => {
    e.stopPropagation();
    
    clearInterval(stopwatchInterval);

    if (stopwatchStarted) {
      card.trackTime(seconds);

      dispatch("trackTime", card);

      seconds = 0;
      stopwatchStarted = false;
    } else {
      stopwatchStarted = true;
      stopwatchInterval = setInterval(() => {
        seconds++;
      }, 1000)
    }
  }

  $: card = c;
  $: checklistCompleted = card.checklist.filter(item => item.checked).length;
  $: totalTrackedTime = card.log.reduce((a: TimeEntry, b: TimeEntry): number => a + b.duration, 0);
  $: hasMoreDetails = !!card.checklist.length || !!card.log.length || !!card.due || !!card.description || card.priority in PRIORITY;
</script>

<div class="card card-label relative group cursor-pointer focus:outline-none focus:border-indigo-500 border-4 border-transparent shadow font-semibold p-2 rounded-sm" 
  class:border-indigo-500={isFocused}
  tabindex="0">
  {#if card.label != null}
    <div class="flex justify-end">
      <div class="w-6 h-2 mb-1 rounded-sm"
        class:bg-red-500={card.label == LABEL_COLOR.RED}
        class:bg-orange-500={card.label == LABEL_COLOR.ORANGE}
        class:bg-yellow-500={card.label == LABEL_COLOR.YELLOW}
        class:bg-green-500={card.label == LABEL_COLOR.GREEN}
        class:bg-teal-500={card.label == LABEL_COLOR.TEAL}
        class:bg-blue-500={card.label == LABEL_COLOR.BLUE}
        class:bg-purple-500={card.label == LABEL_COLOR.PURPLE}
      ></div>
    </div>
  {/if}
  <div class="break-words truncate-3-lines">
    {card.title}
  </div>
  {#if hasMoreDetails}
    <div class="flex justify-between group mt-2 text-sm -mb-1 opacity-75">
      <div class="flex items-center space-x-1.5">
        {#if card.description}
          <div class="py-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10H3M21 6H3M21 14H3M17 18H3"/></svg>
          </div>
        {/if}
        {#if card.checklist.length}
          <div class={checklistCompleted == card.checklist.length ? "flex items-center rounded text-white bg-green-500 p-1" : "flex items-center rounded p-1"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            <span class="ml-1">{checklistCompleted} / {card.checklist.length}</span>
          </div>
        {/if}
        {#if card.log.length}
          <div class="flex items-center rounded py-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>
            <span class="">{formatTime(totalTrackedTime)}</span>
          </div>
        {/if}
        {#if card.due}
          <div class={
              card.isComplete ? "flex items-center rounded text-white bg-green-500 p-1" : 
              beforeDate(card.due, 'today') ? 
                "flex items-center rounded text-white bg-red-600 p-1" : 
                beforeDate(card.due, 'tomorrow') ? 
                  "flex items-center rounded text-white bg-orange-600 p-1" : 
                  "flex items-center rounded p-1"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span class="ml-1">{formatDate(card.due)}</span>
          </div>
        {/if}
        {#if card.priority in PRIORITY}
          <div class="flex font-bold text-center text-white">
            {#if card.priority == PRIORITY.P1}
              <span class="bg-red-500 p-1 rounded" title="Urgent">
                P1
              </span>
            {:else if card.priority == PRIORITY.P2}
              <span class="bg-orange-500 p-1 rounded" title="High">
                P2
              </span>
            {:else if card.priority == PRIORITY.P3}
              <span class="bg-green-500 p-1 rounded" title="Normal">
                P3
              </span>
            {:else if card.priority == PRIORITY.P4}
              <span class="bg-purple-500 p-1 rounded" title="Low">
                P4
              </span>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if isZen}
    <div class="absolute bottom-0 right-0 group-hover:block" class:hidden={!stopwatchStarted}>
      <button class="flex items-center p-1 bg-indigo-500 hover:bg-indigo-600 rounded-tl-sm rounded-br-sm text-white" title="Start time tracking" on:click={handleStopwatchStart}>
        {#if stopwatchStarted}
          <div transition:fly="{{ x: 20 }}" class="relative ml-1 mr-1.5">
            <span class="flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </div>
        {/if}
        <span class="font-mono">{formatForStopwatch(seconds)}</span>
      </button>
    </div>
  {/if}
</div>