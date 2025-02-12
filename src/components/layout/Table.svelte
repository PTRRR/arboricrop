<script module lang="ts">
	export interface Cell {
		label?: string;
		renderHandler?: Snippet<[cell: Cell, row?: Row]>;
		width?: string;
		multiline?: boolean;
	}

	export interface Row {
		href?: string;
		onclick?: () => void;
		selected?: boolean;
		cells: Cell[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		headers?: Cell[];
		rows: Row[];
		style?: string;
	}

	const { headers, rows, style }: Props = $props();

	const getHeaderWidth = (cellIndex: number) => {
		const cell = (headers || [])[cellIndex];
		return cell?.width;
	};
</script>

{#snippet innerRow(cells: Cell[], row: Row)}
	{#each cells as cell, index}
		<div
			class="table__cell"
			style={getCss({
				width: getHeaderWidth(index) || cell.width,
				whiteSpace: cell.multiline ? 'initial' : undefined,
				flex: cell.multiline ? 'initial' : undefined
			})}
		>
			{#if cell.renderHandler}
				{@render cell.renderHandler(cell, row)}
			{:else}
				<span>{cell.label}</span>
			{/if}
		</div>
	{/each}
{/snippet}

<div class="table" {style}>
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
				{@render innerRow(row.cells, row)}
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
				{@render innerRow(row.cells, row)}
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.table {
		$this: &;
		/* background-color: var(--white); */

		&__row {
			position: relative;
			display: flex;
			padding: 0.5rem 0;
			color: black;
			text-decoration: none;
			box-sizing: border-box;
			border-radius: 5px;
			width: 100%;

			& + & {
				&::before {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					display: block;
					content: '';
					border-top: solid 1px var(--grey);
				}
			}

			&#{$this}--selected {
				&::before {
					border-top: solid 1px var(--white);
				}
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

			& + #{$this}__row {
				&::before {
					border-top: solid 1px var(--white);
				}
			}
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
