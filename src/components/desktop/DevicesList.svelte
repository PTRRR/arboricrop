<script lang="ts">
	import Table, { type Cell, type Row } from '../layout/Table.svelte';
	import Stack from './Stack.svelte';
	import type { Device } from '../../utils/types';
	import { getCss } from '../../utils/css';
	import Checkbox from '../mobile-layout/Checkbox.svelte';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		unique?: boolean;
		onselect?: (devices: Device[]) => void;
		devices?: Device[];
	}

	const { onselect, unique, devices = [] }: Props = $props();
	let selectedDevices = $state<Set<Device>>(new Set());

	const headers = $derived(
		onselect
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
			onclick: () => {
				if (unique) selectedDevices.clear();

				if (selectedDevices.has(device)) {
					selectedDevices.delete(device);
				} else {
					selectedDevices.add(device);
				}

				selectedDevices = new Set(selectedDevices);
				onselect?.(Array.from(selectedDevices));
			},
			selected: selectedDevices.has(device),
			cells: onselect
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

{#snippet statusCell(cell: Cell)}
	<Stack direction="horizontal" gap="0.5rem" justifyContent="center" alignItems="center">
		<StatusDot status={cell.label === 'unactive' ? 'neutral' : 'success'} />
		{cell.label}
	</Stack>
{/snippet}

<Table {headers} rows={getRows(rows, statusCell, onselect ? selectCell : undefined)} />
