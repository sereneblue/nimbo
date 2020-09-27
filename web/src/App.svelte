<script lang="ts">
	import { setContext } from 'svelte';
	import { Router, Route } from "svelte-routing";
	
	import TailwindCSS from "./style/TailwindCSS.svelte"
	import { Board, Card, Home } from "./routes";
	import { nimboStore } from "./datastore/stores";

	let loading: Promise<boolean> = $nimboStore.init();

	setContext('nimbo', nimboStore);

	let url: string = "";
</script>

<TailwindCSS />

<Router url="{url}">
	<div class="dark">
		{#await loading then done}
			<Route path="c/:cardId" let:params>
				<Card id={params.cardId} />
			</Route>

			<Route path="b/:boardId" let:params>
				<Board id={params.boardId} />
			</Route>

			<Route path="/" component="{Home}" />
		{/await}
	</div>
</Router>