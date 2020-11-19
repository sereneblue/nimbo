<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { PRIORITY } from '../../types';

  export let selectedPriority: PRIORITY;

  let priority: PRIORITY;

  const dispatch = createEventDispatcher();

  const handlePriorityClick = (p: PRIORITY): void => {
    priority = priority === p ? null : p;
    
    dispatch("update", priority);
  }

  $: {
    priority = selectedPriority;
  }
</script>

<style lang="postcss">
  .priority {
    @apply bg-light-100 opacity-75 text-center w-8 py-1 cursor-pointer rounded;
  }

  .selected {
    @apply font-bold text-white;
  }

  .p1.selected {
    @apply bg-red-500;
  }

  .p2.selected {
    @apply bg-orange-500;
  }

  .p3.selected {
    @apply bg-green-500;
  }

  .p4.selected {
    @apply bg-purple-500;
  }

  :global(.dark .priority) {
    @apply  bg-dark-200;
  }
</style>

<div class="flex space-x-2 text-light dark:text-dark rounded-sm">
  <button on:click={e => handlePriorityClick(PRIORITY.P1) } class="priority p1" class:selected={priority == PRIORITY.P1} title="Urgent">
    P1
  </button>
  <button on:click={e => handlePriorityClick(PRIORITY.P2) } class="priority p2" class:selected={priority == PRIORITY.P2} title="High">
    P2
  </button>
  <button on:click={e => handlePriorityClick(PRIORITY.P3) } class="priority p3" class:selected={priority == PRIORITY.P3} title="Normal">
    P3
  </button>
  <button on:click={e => handlePriorityClick(PRIORITY.P4) } class="priority p4" class:selected={priority == PRIORITY.P4} title="Low">
    P4
  </button>
</div>