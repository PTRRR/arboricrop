<script lang="ts">
	import { getCss } from '../utils/css';

	type T = $$Generic;
	type HeaderValue = { size?: string; label?: string };
	type Headers = { [K in keyof T]?: HeaderValue };

	export let items: T[] = [];
	export let headers: Headers | undefined = undefined;
	export let onSelect: ((item: T) => void) | undefined = undefined;

	$: headerStyles = Object.keys(headers || {}).reduce<Record<keyof T, string>>(
		(acc, key) => {
			acc[key as keyof T] = getCss({
				width: `var(--header-${key})`
			});
			return acc;
		},
		{} as Record<keyof T, string>
	);

	$: headerVars = Object.entries((headers || {}) as Headers).reduce<Record<string, string>>(
		(acc, [key, value]) => {
			acc[`--header-${key}`] = (value as HeaderValue).size || '';
			return acc;
		},
		{}
	);

	$: headerItems = Object.entries(headers || {}).map(([key, value]) => ({
		key,
		label: (value as HeaderValue)?.label || key
	}));
</script>

<div class="list" class:list--selectable={!!onSelect} style={getCss(headerVars)}>
	<div class="list__row">
		{#each headerItems as header}
			<div
				class="list__header-item"
				style={getCss({
					width: `var(--header-${header.key})`
				})}
			>
				{header.label}
			</div>
		{/each}
	</div>
	{#each items as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="list__row" on:click={() => onSelect?.(item)}>
			<slot {item} {headerStyles} />
		</div>
	{/each}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
	}

	.list--selectable {
		cursor: pointer;
	}

	.list--selectable .list__row:hover {
		background-color: var(--dark-gray);
	}

	.list__row {
		display: flex;
		padding: 0.5rem 0;
		gap: var(--gap);
	}

	.list__row + .list__row {
		border-top: solid 1px var(--dark-gray);
	}
</style>
