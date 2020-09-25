<script lang="ts">
	import { Router, Route } from "svelte-routing";
	
	import TailwindCSS from "./style/TailwindCSS.svelte"

	import { Board, Card, Home } from "./routes";

	let url: string = "";
</script>

<TailwindCSS />

<Router url="{url}">
	<div class="dark">
		<Route path="c/:cardId" let:params>
			<Card id={params.cardId} />
		</Route>

		<Route path="b/:boardId" let:params>
			<Board id={params.boardId} />
		</Route>

		<Route path="/" component="{Home}" />
	</div>
</Router>