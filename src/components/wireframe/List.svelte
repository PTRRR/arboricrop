<script lang="ts">
	import { camelToKebab } from '../../utils/strings';
	import { getCss } from '../../utils/css';

	type T = $$Generic;
	type HeaderValue = { size?: string; label?: string };
	type Headers = Record<string, HeaderValue>;

	export let items: T[] = [];
	export let headers: Headers | undefined = undefined;
	export let onSelect: ((item: T) => void) | undefined = undefined;

	$: headerStyles = Object.keys(headers || {}).reduce<Record<keyof Headers, string>>(
		(acc, key) => {
			acc[key as keyof Headers] = getCss({
				width: `var(--header-${camelToKebab(key)})`
			});
			return acc;
		},
		{} as Record<keyof T, string>
	);

	$: headerVars = Object.entries((headers || {}) as Headers).reduce<Record<string, string>>(
		(acc, [key, value]) => {
			acc[`--header-${camelToKebab(key)}`] = (value as HeaderValue).size || '';
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
	{#if headerItems.length > 0}
		<div class="list__headers">
			{#each headerItems as header}
				<div
					class="list__header-item"
					style={getCss({
						width: `var(--header-${camelToKebab(header.key)})`
					})}
				>
					{header.label}
				</div>
			{/each}
		</div>
	{/if}

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

	.list__row,
	.list__headers {
		display: flex;
		padding: 0.5rem 0;
		gap: var(--gap);
	}

	.list__headers {
		padding-top: 0;
		color: var(--dark-gray);
		border-bottom: solid 1px var(--dark-gray);
	}

	.list__row + .list__row {
		border-top: solid 1px var(--dark-gray);
	}
</style>
