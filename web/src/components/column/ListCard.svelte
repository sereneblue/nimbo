<script lang="ts">
  import type Card from '../../datastore/models/Card';

  export let c: Card;

  const handleCardClick = (e: Event): void => {

  }
</script>

<div class="card cursor-pointer focus:outline-none focus:border-white border border-transparent shadow font-semibold p-2 rounded-sm" on:click={handleCardClick} tabindex="0">
  <div class="break-words">
    {c.title}
  </div>
</div>