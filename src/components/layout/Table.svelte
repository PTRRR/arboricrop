<script module lang="ts">
	export interface Cell {
		label?: string;
		renderHandler?: Snippet<[cell: Cell, row?: Row]>;
		width?: string;
		multiline?: boolean;
	}

	export type HeaderCell = Cell & { sortable?: boolean };

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
	import Pagination from './Pagination.svelte';
	import Spacer from '../Spacer.svelte';

	interface Props {
		headers?: HeaderCell[];
		rows: Row[];
		style?: string;
		borders?: boolean;
		pageSize?: number;
	}

	const { headers, rows, style, borders = true, pageSize = 0 }: Props = $props();

	const getHeaderWidth = (cellIndex: number) => {
		const cell = (headers || [])[cellIndex];
		return cell?.width;
	};

	let pageIndex = $state(0);
	const pages = $derived(
		typeof pageSize === 'number' && pageSize > 0 ? Math.ceil(rows.length / pageSize) : 0
	);

	const paginatedRows = $derived(
		pages > 0 ? rows.slice(pageIndex * (pageSize || 0), (pageIndex + 1) * (pageSize || 0)) : rows
	);
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
		<div class="table__row table__headers" class:table--borders={borders}>
			{#each headers as header}
				<div
					class="table__cell"
					class:table--sortable={header.sortable}
					style={getCss({ width: header.width })}
				>
					<span>{header.label}</span>
				</div>
			{/each}
		</div>
	{/if}

	{#each paginatedRows as row}
		{#if row.href}
			<a
				class="table__row table__data table--clickable"
				class:table--borders={borders}
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
				class:table--borders={borders}
				class:table--clickable={row.onclick}
				class:table--selected={row.selected}
				onclick={row.onclick}
			>
				{@render innerRow(row.cells, row)}
			</div>
		{/if}
	{/each}

	{#if pages > 1}
		<Spacer size="2rem" />
		<Pagination onselect={(index) => (pageIndex = index)} {pages} />
	{/if}
</div>

<style lang="scss">
	.table {
		$root: &;

		&__row {
			$row: &;
			position: relative;
			display: flex;
			padding: 0.7rem 0;
			color: black;
			text-decoration: none;
			box-sizing: border-box;
			border-radius: 5px;
			width: 100%;

			&#{$root}--borders {
				& + & {
					&::before {
						border-top: solid 1px var(--grey);
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						display: block;
						content: '';
					}
				}
			}

			&#{$root}--selected,
			#{$root}--selected + & {
				&::before {
					border-top: solid 1px var(--light-grey) !important;
					width: calc(100% - 5px) !important;
					left: 2.5px !important;
				}
			}
		}

		&--clickable {
			cursor: pointer;

			&:hover {
				background-color: var(--light-grey);
			}
		}

		&--selected {
			background-color: var(--grey);

			&:hover {
				background-color: var(--grey);
			}

			& + #{$root}__row {
				&::before {
					border-top: solid 1px var(--white);
				}
			}
		}

		&__headers {
			color: var(--dark-grey);
		}

		&__cell {
			display: flex;
			white-space: nowrap;
			text-transform: lowercase;
			flex: 0 0 auto;

			#{$root}__headers & {
				span {
					font-weight: 400;
				}
			}

			&#{$root}--sortable {
				// display: none;

				&::before {
					content: '<>';
					transform: rotate(90deg) translate(0, 2px);
				}
			}

			span {
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				font-weight: 500;
			}
		}

		&__data {
			font-weight: normal;
		}
	}
</style>
