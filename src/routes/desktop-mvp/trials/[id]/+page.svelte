<script lang="ts">
	import { page } from '$app/stores';
	import Section from '../../../../components/desktop/Section.svelte';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import { useCurrentAccount, useDevices, useTrials } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import type { Cell, Row } from '../../../../components/layout/Table.svelte';
	import type { Snippet } from 'svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import StatusDot from '../../../../components/mobile-layout/StatusDot.svelte';
	import Table from '../../../../components/layout/Table.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import Pagination from '../../../../components/layout/Pagination.svelte';
	import type { Device } from '../../../../utils/types';
	import { getCss } from '../../../../utils/css';
	import Checkbox from '../../../../components/mobile-layout/Checkbox.svelte';
	import DevicesList from '../../../../components/desktop/DevicesList.svelte';

	const trialId = $page.params.id;
	const { trials } = useTrials();
	const { devices, updateDevices } = useDevices();
	const { currentAccount } = useCurrentAccount();

	const trial = $derived($trials.find((it) => it.id === trialId));
	const trialDevices = $derived($devices.filter((it) => it.parentId === trial?.id));
	const accountDevices = $derived(
		$devices.filter((it) => !it.parentId && it.accountId === $currentAccount?.id)
	);

	let map = $state<Map | undefined>(undefined);
	let selectedDevices = $state<Set<Device>>(new Set());

	const trialDevicesRows = $derived<Row[]>(
		trialDevices.map((device) => ({
			cells: [
				{ label: device.id },
				{ label: device.name },
				{ label: device.status },
				{ label: `${device.battery}%` }
			]
		}))
	);

	const accountDevicesRows = $derived<Row[]>(
		accountDevices.map((device) => ({
			onclick: () => {
				if (selectedDevices.has(device)) {
					selectedDevices.delete(device);
				} else {
					selectedDevices.add(device);
				}
				selectedDevices = new Set(selectedDevices);
			},
			selected: selectedDevices.has(device),
			cells: [
				{ label: '' },
				{ label: device.id },
				{ label: device.name },
				{ label: device.status },
				{ label: `${device.battery}%` }
			]
		}))
	);

	const getRowsWithRenderHandler = (
		rows: Row[],
		renderHandler: Snippet<[cell: Cell, row?: Row]>
	): Row[] =>
		rows.map((row) => {
			const [idCell, nameCell, statusCell, ...cells] = row.cells;
			return {
				...row,
				cells: [idCell, nameCell, { ...statusCell, renderHandler }, ...cells]
			};
		});

	const getAccountDevicesRows = (
		rows: Row[],
		selectRenderHandler: Snippet<[cell: Cell, row?: Row]>,
		statusRenderHandler: Snippet<[cell: Cell, row?: Row]>
	): Row[] =>
		rows.map((row) => {
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
		});
</script>

{#if trial}
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

	<Stack style={{ width: '100%' }} direction="horizontal">
		<Section>
			<PageHeader title={trial.name} subTitle={`${trialDevices.length} Devices`} />
			<Map
				ratio={3.5}
				bind:this={map}
				maxBounds={swissBounds}
				zoom={14}
				minZoom={3}
				maxZoom={18}
				center={trial.center}
				markers={[]}
				geoJSONs={trial.layers}
				onChange={(value) => {
					// const delta = getLocationDelta(value, newTrial.center);
					// if (delta > 0.000001) coords = value;
				}}
			/>

			<DevicesList devices={trialDevices} />
		</Section>

		<Section label="Available devices" backgroundColor="var(--light-grey)" width="40%">
			<Table
				headers={[
					{ label: '', width: '7%' },
					{ label: 'ID', width: '30%' },
					{ label: 'name', width: '20%' },
					{ label: 'status', width: '20%' },
					{ label: 'battery', width: '10%' }
				]}
				rows={getAccountDevicesRows(accountDevicesRows, selectCell, statusCell)}
			/>

			<!-- <DevicesList devices={accountDevices} select /> -->

			<Pagination pages={3} />

			<Stack gap="0.5rem">
				<Button
					icon="check"
					backgroundColor="var(--light-green)"
					iconBackgroundColor="var(--green)"
					padding
					onclick={() => {
						updateDevices(Array.from(selectedDevices).map((it) => ({ ...it, parentId: trial.id })));
					}}
				>
					Add
				</Button>
				<Button
					icon="cross"
					backgroundColor="var(--light-red)"
					iconBackgroundColor="var(--red)"
					padding
				>
					Close
				</Button>
			</Stack>
		</Section>
	</Stack>
{/if}
