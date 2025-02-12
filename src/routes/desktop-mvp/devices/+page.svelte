<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../components/desktop/Section.svelte';
	import Table, { type Cell, type Row } from '../../../components/layout/Table.svelte';
	import { formatDateToDDMMYYYY } from '../../../utils/dates';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import { getCss } from '../../../utils/css';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import type { Device } from '../../../utils/types';

	function generateRandomVersion(): string {
		const major = Math.floor(Math.random() * 5); // 0-4
		const minor = Math.floor(Math.random() * 10); // 0-9
		const patch = Math.floor(Math.random() * 10); // 0-9
		return `v${major}.${minor}.${patch}`;
	}

	function getRandomDate(): Date {
		const today = new Date();
		const lastYear = new Date();
		lastYear.setFullYear(lastYear.getFullYear() - 1);
		return new Date(lastYear.getTime() + Math.random() * (today.getTime() - lastYear.getTime()));
	}

	function generateRandomDevices(count: number): Device[] {
		const devices: Device[] = [];

		for (let i = 0; i < count; i++) {
			const device: Device = {
				id: createId(),
				firmwareVersion: generateRandomVersion(),
				status: 'unactive',
				creationDate: formatDateToDDMMYYYY(getRandomDate()),
				medias: []
			};

			devices.push(device);
		}

		return devices;
	}

	const devices = $state(generateRandomDevices(30));
	let selectedDevices = $state(new Set<Device>());

	const rows = $derived<Row[]>(
		devices.map((device) => ({
			selected: selectedDevices.has(device),
			onclick: () => {
				if (selectedDevices.has(device)) {
					selectedDevices.delete(device);
				} else {
					selectedDevices.add(device);
				}
				selectedDevices = new Set(selectedDevices);
			},
			cells: [
				{ label: '' },
				{ label: device.id },
				{ label: device.firmwareVersion },
				{ label: device.creationDate }
			]
		}))
	);

	const rowsWithRenderHandler = $derived(
		(rows: Row[], renderHandler: Cell['renderHandler']): Row[] =>
			rows.map((row) => ({
				...row,
				cells: [{ ...row.cells[0], renderHandler }, row.cells[1], row.cells[2], row.cells[3]]
			}))
	);
</script>

{#snippet selectionCell(cell: Cell, row?: Row)}
	<div style={getCss({ padding: '0 0 0 0.5rem' })}>
		{#if row?.selected}
			<Checkbox raw initialChecked />
		{:else}
			<Checkbox raw />
		{/if}
	</div>
{/snippet}

<Section label="Available Devices" padding="2rem">
	<div>
		<TextInput label="Query" />
		<Spacer />
		<Button icon="navigate">Search</Button>
	</div>
	<Table
		style={getCss({ width: '100%' })}
		headers={[
			{ label: '', width: '5%' },
			{ label: 'ID', width: '25%' },
			{ label: 'Firmware Version', width: '20%' },
			{ label: 'Creation Date' }
		]}
		rows={rowsWithRenderHandler(rows, selectionCell)}
	/>
	<Pagination pages={10} />
</Section>
