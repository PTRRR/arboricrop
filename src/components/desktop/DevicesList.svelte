<script lang="ts">
	import Table, { type Cell, type Row } from '../layout/Table.svelte';
	import Stack from './Stack.svelte';
	import type { Device } from '../../utils/types';
	import { getCss } from '../../utils/css';
	import Checkbox from '../mobile-layout/Checkbox.svelte';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		select?: boolean;
		devices?: Device[];
	}

	const { select, devices = [] }: Props = $props();

	const headers = $derived(
		select
			? [
					{ label: '', width: '7%' },
					{ label: 'ID', width: '30%' },
					{ label: 'name', width: '20%' },
					{ label: 'status', width: '20%' },
					{ label: 'battery', width: '10%' }
				]
			: [
					{ label: 'ID', width: '30%' },
					{ label: 'name', width: '20%' },
					{ label: 'status', width: '20%' },
					{ label: 'battery', width: '10%' }
				]
	);

	const rows = $derived<Row[]>(
		devices.map((device) => ({
			// onclick: () => {
			// 	if (selectedDevices.has(device)) {
			// 		selectedDevices.delete(device);
			// 	} else {
			// 		selectedDevices.add(device);
			// 	}
			// 	selectedDevices = new Set(selectedDevices);
			// },
			// selected: selectedDevices.has(device),
			cells: select
				? [
						{ label: '' },
						{ label: device.id },
						{ label: device.name },
						{ label: device.status },
						{ label: `${device.battery}%` }
					]
				: [
						{ label: device.id },
						{ label: device.name },
						{ label: device.status },
						{ label: `${device.battery}%` }
					]
		}))
	);

	const getRows = (
		rows: Row[],
		statusRenderHandler: Snippet<[cell: Cell, row?: Row]>,
		selectRenderHandler?: Snippet<[cell: Cell, row?: Row]>
	): Row[] =>
		rows.map((row) => {
			if (selectRenderHandler) {
				const [selectCell, idCell, nameCell, statusCell, ...cells] = row.cells;
				return {
					...row,
					cells: [
						{ ...selectCell, renderHandler: selectRenderHandler },
						idCell,
						nameCell,
						{ ...statusCell, renderHandler: statusRenderHandler },
						...cells
					]
				};
			} else {
				const [idCell, nameCell, statusCell, ...cells] = row.cells;
				return {
					...row,
					cells: [idCell, nameCell, { ...statusCell, renderHandler: statusRenderHandler }, ...cells]
				};
			}
		});
</script>

{#snippet selectCell(cell: Cell, row?: Row)}
	<div style={getCss({ padding: '0 0 0 0.5rem' })}>
		{#if row?.selected}
			<Checkbox raw initialChecked />
		{:else}
			<Checkbox raw />
		{/if}
	</div>
{/snippet}

{#snippet statusCell(cell: Cell, row?: Row)}
	<Stack direction="horizontal" gap="0.5rem" justifyContent="center" alignItems="center">
		<StatusDot status="error" />
		{cell.label}
	</Stack>
{/snippet}

<Table {headers} rows={getRows(rows, statusCell, select ? selectCell : undefined)} />
