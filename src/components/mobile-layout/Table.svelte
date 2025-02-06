<script lang="ts">
	import { getCss } from '../../utils/css';

	export interface Cell {
		label: string;
		width?: string;
		multiline?: boolean;
	}

	export interface Row {
		href?: string;
		onclick?: () => void;
		selected?: boolean;
		cells: Cell[];
	}

	const {
		headers,
		rows
	}: {
		headers?: Cell[];
		rows: Row[];
	} = $props();

	const getHeaderWidth = (cellIndex: number) => {
		const cell = (headers || [])[cellIndex];
		return cell?.width;
	};
</script>

{#snippet innerRow(cells: Cell[])}
	{#each cells as cell, index}
		<div
			class="table__cell"
			style={getCss({
				width: getHeaderWidth(index) || cell.width,
				whiteSpace: cell.multiline ? 'initial' : undefined,
				flex: cell.multiline ? 'initial' : undefined
			})}
		>
			<span>{cell.label}</span>
		</div>
	{/each}
{/snippet}

<div class="table">
	{#if headers}
		<div class="table__row table__headers">
			{#each headers as header}
				<div class="table__cell" style={getCss({ width: header.width })}>
					<span>{header.label}</span>
				</div>
			{/each}
		</div>
	{/if}

	{#each rows as row}
		{#if row.href}
			<a
				class="table__row table__data table--clickable"
				class:table--selected={row.selected}
				href={row.href}
				onclick={row.onclick}
			>
				{@render innerRow(row.cells)}
			</a>
		{:else}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="table__row table__data"
				class:table--clickable={row.onclick}
				class:table--selected={row.selected}
				onclick={row.onclick}
			>
				{@render innerRow(row.cells)}
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.table {
		background-color: var(--white);

		&__row {
			display: flex;
			padding: 0.5rem 0;
			color: black;
			text-decoration: none;
			box-sizing: border-box;

			& + & {
				border-top: solid 1px var(--grey);
			}
		}

		&--clickable {
			cursor: pointer;

			&:hover {
				background-color: var(--grey);
			}
		}

		&--selected {
			background-color: var(--grey);
		}

		&__headers {
			color: var(--grey);
		}

		&__cell {
			display: flex;
			white-space: nowrap;
			text-transform: lowercase;
			flex: 0 0 auto;

			span {
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		&__data {
			font-weight: normal;
		}
	}
</style>
