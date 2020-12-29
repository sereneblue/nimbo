<script lang="ts">
  import { setContext } from 'svelte';
  import Router from 'svelte-spa-router';
  import { BroadcastChannel } from 'broadcast-channel';

  import TailwindCSS from "./style/TailwindCSS.svelte"
  import { Board, Card, Home, Zen } from "./routes";
  import { nimboStore } from "./datastore/stores";

  const channel: BroadcastChannel<any> = new BroadcastChannel('nimbo');

  let timeout: number = 0; 

  $nimboStore.setChannel(channel);

  channel.onmessage = async (msg: any): Promise<void> => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      await $nimboStore.refresh();
      $nimboStore = $nimboStore;
    }, 250)
  }

  let loading: Promise<boolean> = $nimboStore.init();

  setContext('nimbo', nimboStore);

  const routes = {
    '/c/:cardId': Card,
    '/b/:boardId': Board,
    '/zen': Zen,
    '/': Home
  }
</script>

<TailwindCSS />

{#await loading then done}
  <div class:dark={$nimboStore.settings.theme === "dark"}>
    <Router {routes}/>
  </div>
{/await}
