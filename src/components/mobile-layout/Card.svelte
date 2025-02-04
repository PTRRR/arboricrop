<script lang="ts">
	import type { Snippet } from 'svelte';

	const props: { children: Snippet; href?: string } = $props();
</script>

{#snippet cardInner()}
	{@render props.children()}
{/snippet}

{#if props.href}
	<a class="card" href={props.href}>
		{@render cardInner()}
	</a>
{:else}
	<div class="card">
		{@render cardInner()}
	</div>
{/if}

<style lang="scss">
	.card {
		text-decoration: none;
		color: black;
		background-color: lightgray;
		padding: 0.5rem;
		border-radius: 5px;
	}
</style>
