<script lang="ts">
	import Section from '../../../components/desktop/Section.svelte';
	import Table, { type Cell, type Row } from '../../../components/layout/Table.svelte';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import { getCss } from '../../../utils/css';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import type { Account, Device } from '../../../utils/types';
	import Stack from '../../../components/desktop/Stack.svelte';
	import { useAccounts, useDevices } from '../../../stores';

	const { devices, updateDevices } = useDevices();
	let selectedDevices = $state(new Set<Device>());

	const devicesRows = $derived<Row[]>(
		$devices
			.filter((it) => !it.accountId)
			.slice(0, 30)
			.map((device) => ({
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

	const { accounts } = useAccounts();
	let selectedAccount: Account | undefined = $state(undefined);
	const accountsRows = $derived<Row[]>(
		$accounts.slice(0, 10).map((account) => ({
			selected: selectedAccount?.id === account.id,
			onclick: () => {
				if (selectedAccount?.id === account.id) {
					selectedAccount = undefined;
				} else {
					selectedAccount = account;
				}
			},
			cells: [{ label: '' }, { label: account.organizationName }, { label: account.email }]
		}))
	);

	const rowsWithRenderHandler = (rows: Row[], renderHandler: Cell['renderHandler']): Row[] =>
		rows.map((row) => {
			const [firstCell, ...otherCells] = row.cells;
			return {
				...row,
				cells: [{ ...firstCell, renderHandler }, ...otherCells]
			};
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

<Stack direction="horizontal">
	<Section label="Available Devices" padding="1rem" fill>
		<div>
			<TextInput label="Filter" />
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
			rows={rowsWithRenderHandler(devicesRows, selectCell)}
		/>
		<Pagination pages={10} />
	</Section>

	{#if selectedDevices.size > 0}
		<Section
			sticky="5.5rem"
			width="50%"
			padding="1rem"
			label={`${selectedDevices.size} Selected Devices`}
		>
			<div>
				<TextInput label="Search Account" />
				<Spacer />
				<Button icon="navigate">Search</Button>
			</div>
			<Table
				headers={[
					{ label: '', width: '10%' },
					{ label: 'Organisation', width: '45%' },
					{ label: 'Email', width: '45%' }
				]}
				rows={rowsWithRenderHandler(accountsRows, selectCell)}
			/>
			<Pagination pages={4} />
			<Button
				icon="check"
				backgroundColor={selectedAccount ? 'var(--light-green)' : 'var(--grey)'}
				iconBackgroundColor="var(--green)"
				padding
				disabled={!selectedAccount}
				onclick={() => {
					if (selectedAccount) {
						updateDevices(
							Array.from(selectedDevices).map((it) => ({ ...it, accountId: selectedAccount?.id }))
						);

						selectedDevices = new Set();
						selectedAccount = undefined;
					}
				}}
			>
				Assign {selectedDevices.size} devices to account
			</Button>
		</Section>
	{/if}
</Stack>
