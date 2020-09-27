<script lang="ts">
  import { getContext } from 'svelte';

  import type nimbo from '../nimbo';

  export let id: string;

  const nimboStore: Writable<nimbo> = getContext('nimbo');

  let boardIndex: number = $nimboStore.boards.findIndex(b => b.id === id);

  if (boardIndex > -1) {
    $nimboStore.updateViewTime($nimboStore.boards[boardIndex].id);
  }
</script>

<div class="flex flex-col max-h-screen h-screen overflow-hidden bg-light-300 dark:bg-dark-300 text-light dark:text-dark">
  {id}
</div>