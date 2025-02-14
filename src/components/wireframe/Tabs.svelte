<script lang="ts">
	import type { Tab } from '../../utils/types';
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';

	type T = $$Generic;
	export let tabs: Tab[] = [];
	export let onSelect: ((tab: Tab) => void) | undefined = undefined;
	export let selected: Tab | undefined = tabs[0] || undefined;
</script>

<div class="tabs">
	<div class="tabs__header">
		{#each tabs as tab}
			<Button
				selected={selected?.value === tab.value}
				on:click={() => {
					selected = tab;
					onSelect?.(selected);
				}}
			>
				{tab.label || tab.value}
			</Button>
		{/each}
	</div>
	<Spacer />
	<slot {selected} />
</div>

<style>
	.tabs__header {
		display: flex;
		align-items: center;
		gap: var(--gap);
	}
</style>
