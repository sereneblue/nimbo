<script lang="ts">
  import { setContext } from 'svelte';
  import Router from 'svelte-spa-router';
  
  import TailwindCSS from "./style/TailwindCSS.svelte"
  import { Board, Card, Home } from "./routes";
  import { nimboStore } from "./datastore/stores";

  let loading: Promise<boolean> = $nimboStore.init();

  setContext('nimbo', nimboStore);

  const routes = {
    '/c/:cardId': Card,
    '/b/:boardId': Board,
    '/': Home
  }
</script>

<TailwindCSS />

{#await loading then done}
  <div class:dark={$nimboStore.theme === "dark"}>
    <Router {routes}/>
  </div>
{/await}
