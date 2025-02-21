<script lang="ts">
	import Table, { type Cell, type HeaderCell, type Row } from '../layout/Table.svelte';
	import Stack from './Stack.svelte';
	import type { Device } from '../../utils/types';
	import { getCss } from '../../utils/css';
	import Checkbox from '../mobile-layout/Checkbox.svelte';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		multi?: boolean;
		onselect?: (devices: Device[]) => void;
		devices?: Device[];
	}

	const { onselect, multi = true, devices = [] }: Props = $props();
	let selectedDevices = $state<Set<Device>>(new Set());

	const headers = $derived<HeaderCell[]>(
		onselect
			? [
					// { label: '', width: '7%' },
					{ label: 'ID', width: '30%', sortable: true },
					{ label: 'name', width: '15%', sortable: true },
					{ label: 'status', width: '15%', sortable: true },
					{ label: 'battery', width: '10%', sortable: true },
					{ label: 'firmware version', width: '10%', sortable: true }
				]
			: [
					{ label: 'ID', width: '20%', sortable: true },
					{ label: 'name', width: '20%', sortable: true },
					{ label: 'status', width: '20%', sortable: true },
					{ label: 'battery', width: '10%', sortable: true },
					{ label: 'firmware version', width: '10%', sortable: true }
				]
	);

	const hasDevice = $derived((device: Device) =>
		Boolean(Array.from(selectedDevices).find((it) => it.id === device.id))
	);

	const rows = $derived<Row[]>(
		devices.map((device) => ({
			onclick: () => {
				if (!onselect) return;

				if (hasDevice(device)) {
					selectedDevices.delete(device);
				} else {
					if (!multi) selectedDevices.clear();
					selectedDevices.add(device);
				}

				selectedDevices = new Set(selectedDevices);
				onselect(Array.from(selectedDevices));
			},
			selected: hasDevice(device),
			cells: onselect
				? [
						{ label: '' },
						{ label: device.id },
						{ label: device.name },
						{ label: device.status },
						{ label: `${device.battery}%` },
						{ label: `${device.firmwareVersion}` }
					]
				: [
						{ label: device.id },
						{ label: device.name },
						{ label: device.status },
						{ label: `${device.battery}%` },
						{ label: `${device.firmwareVersion}` }
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
						// { ...selectCell, renderHandler: selectRenderHandler },
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

<Table
	{headers}
	rows={getRows(rows, statusCell, onselect ? selectCell : undefined)}
	pageSize={10}
/>
