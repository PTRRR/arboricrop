<script lang="ts">
	import Button from '../Button.svelte';

	type T = $$Generic;
	export let items: T[] = [];
	export let onSelect: ((item: T) => void) | undefined = undefined;
	export let selectedItems: T[] = [];
</script>

<div class="list">
	{#each items as item}
		<Button minimal on:click={() => onSelect?.(item)} selected={selectedItems.includes(item)}>
			<div class="list__item-content">
				<slot {item} />
			</div>
		</Button>
	{/each}
</div>

<style>
	.list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.list__item-content {
		display: flex;
		justify-content: space-between;
	}
</style>
