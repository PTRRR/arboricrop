<script lang="ts">
	import type { Device } from '../../../utils/types';
	import { useCurrentAccount, useDevices } from '../../../stores';
	import type { Cell, Row } from '../../../components/layout/Table.svelte';
	import Section from '../../../components/desktop/Section.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import type { Snippet } from 'svelte';
	import StatusDot from '../../../components/mobile-layout/StatusDot.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import TextareaInput from '../../../components/layout/TextareaInput.svelte';

	const { devices, updateDevice } = useDevices();
	const { currentAccount } = useCurrentAccount();
	let selectedDevice = $state<Device | undefined>(undefined);
	let deviceName = $state('');
	let deviceNote = $state('');

	const selectedDeviceHasChanges = $derived(
		selectedDevice &&
			((selectedDevice.name || '') !== deviceName || (selectedDevice.note || '') !== deviceNote)
	);

	const accountDevices = $derived(
		$devices.filter((it) => it.accountId === $currentAccount?.id).slice(0, 30)
	);

	const rows = $derived<Row[]>(
		accountDevices.map((device) => ({
			onclick: () => {
				selectedDevice = selectedDevice?.id === device.id ? undefined : device;
				deviceName = selectedDevice?.name || '';
				deviceNote = selectedDevice?.note || '';
			},
			selected: selectedDevice?.id === device.id,
			cells: [
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
</script>

{#snippet statusCell(cell: Cell, row?: Row)}
	<Stack direction="horizontal" gap="0.5rem" justifyContent="center" alignItems="center">
		<StatusDot status="error" />
		{cell.label}
	</Stack>
{/snippet}

<Stack direction="horizontal" style={{ width: '100%' }} alignItems="flex-start">
	<Section label="Account devices" fill>
		<Stack gap="0.5rem">
			<TextInput label="Search" />
			<Button icon="navigate">Submit</Button>
		</Stack>
		<Table
			headers={[
				{ label: 'ID', width: '25%' },
				{ label: 'name', width: '15%' },
				{ label: 'status', width: '15%' },
				{ label: 'battery', width: '10%' }
			]}
			rows={getRowsWithRenderHandler(rows, statusCell)}
		/>
		<Pagination pages={10} />
	</Section>

	{#if selectedDevice}
		{#snippet deviceLabel()}
			<Stack direction="horizontal" gap="0.5rem" alignItems="center">
				<StatusDot status="error" />
				{selectedDevice?.name}
			</Stack>
		{/snippet}

		<Section
			label={deviceLabel}
			backgroundColor="var(--light-grey)"
			width="30%"
			sticky="var(--content-offset-top)"
		>
			<TextInput label="ID" value={selectedDevice.id} readonly />
			<TextInput label="Version" value={selectedDevice.firmwareVersion} readonly />
			<TextInput label="Name" bind:value={deviceName} />
			<TextareaInput label="Note" bind:value={deviceNote} />

			<Stack gap="0.5rem">
				<Button
					icon="check"
					disabled={!selectedDeviceHasChanges}
					backgroundColor="var(--light-green)"
					iconBackgroundColor="var(--green)"
					padding
					onclick={() => {
						if (!selectedDevice) return;

						updateDevice({
							...selectedDevice,
							name: deviceName,
							note: deviceNote
						});

						selectedDevice = accountDevices.find((it) => it.id === selectedDevice?.id);
					}}
				>
					Save
				</Button>
				<Button
					icon="cross"
					backgroundColor="var(--light-red)"
					iconBackgroundColor="var(--red)"
					padding
					onclick={() => (selectedDevice = undefined)}
				>
					Close
				</Button>
			</Stack>
		</Section>
	{/if}
</Stack>
