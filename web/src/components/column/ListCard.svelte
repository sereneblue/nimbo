<script lang="ts">
  import type Card from '../../datastore/models/Card';
  import { PRIORITY, LABEL_COLOR } from '../../types';
  import { formatDate } from '../../util';
  
  export let c: Card;

  let hasMoreDetails: boolean = !!c.checklist.length || !!c.due || !!c.description || c.priority in PRIORITY;
  let checklistCompleted: number = c.checklist.filter(item => item.checked).length;
  
  const handleCardClick = (e: Event): void => {
  }

  const handleTimeTracking = (e: Event): void => {
    e.stopPropagation();
  }
</script>

<div class="card card-label relative group cursor-pointer focus:outline-none focus:border-white border border-transparent shadow font-semibold p-2 rounded-sm" on:click={handleCardClick} tabindex="0">
  {#if c.label != null}
    <div class="flex justify-end">
      <div class="w-6 h-2 mb-1 rounded-sm"
        class:bg-red-500={c.label == LABEL_COLOR.RED}
        class:bg-orange-500={c.label == LABEL_COLOR.ORANGE}
        class:bg-yellow-500={c.label == LABEL_COLOR.YELLOW}
        class:bg-green-500={c.label == LABEL_COLOR.GREEN}
        class:bg-teal-500={c.label == LABEL_COLOR.TEAL}
        class:bg-blue-500={c.label == LABEL_COLOR.BLUE}
        class:bg-purple-500={c.label == LABEL_COLOR.PURPLE}
      ></div>
    </div>
  {/if}
  <div class="break-words">
    {c.title}
  </div>
  {#if hasMoreDetails}
    <div class="flex justify-between group mt-2 text-sm -mb-1 opacity-75">
      <div class="flex items-center">
        {#if c.description}
          <div class="mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10H3M21 6H3M21 14H3M17 18H3"/></svg>
          </div>
        {/if}
        {#if c.checklist.length}
          <div class={checklistCompleted == c.checklist.length ? "flex items-center p-1 rounded mr-2 text-white bg-green-500" : "flex items-center p-1 rounded mr-1"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            <span class="ml-1">{checklistCompleted} / {c.checklist.length}</span>
          </div>
        {/if}
        {#if c.due}
          <div class={c.isComplete ? "flex items-center p-1 rounded mr-2 text-white bg-green-500" : c.due < new Date().getTime() ? "flex items-center p-1 rounded mr-2 text-white bg-orange-600" : "flex items-center p-1 rounded mr-1"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span class="ml-1">{formatDate(c.due)}</span>
          </div>
        {/if}
        {#if c.priority in PRIORITY}
          <div class="flex font-bold text-center text-white">
            {#if c.priority == PRIORITY.P1}
              <span class="bg-red-500 p-1 rounded" title="Urgent">
                P1
              </span>
            {/if}
            {#if c.priority == PRIORITY.P2}
              <span class="bg-orange-500 p-1 rounded" title="High">
                P2
              </span>
            {/if}
            {#if c.priority == PRIORITY.P3}
              <span class="bg-green-500 p-1 rounded" title="Normal">
                P3
              </span>
            {/if}
            {#if c.priority == PRIORITY.P4}
              <span class="bg-purple-500 p-1 rounded" title="Low">
                P4
              </span>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
  <div class="absolute bottom-0 right-0 hidden group-hover:block">
    <div class="flex items-center p-2 rounded" title="Start time tracking" on:click={handleTimeTracking}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>
    </div>
  </div>
</div>