<script lang="ts">
	import Section from '../../../components/desktop/Section.svelte';
	import Table, { type Cell, type Row } from '../../../components/layout/Table.svelte';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import { getCss } from '../../../utils/css';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import type { Account, Device } from '../../../utils/types';
	import Stack from '../../../components/desktop/Stack.svelte';
	import { useAccounts, useDevices } from '../../../stores';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import PageLayout from '../../../components/desktop/PageLayout.svelte';
	import Button from '../../../components/layout/Button.svelte';

	const { devices, updateDevices } = useDevices();
	let selectedDevices = $state(new Set<Device>());
	let assignDevices = $state(false);

	const devicesRows = $derived<Row[]>(
		$devices
			.filter((it) => !it.accountId)
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
		$accounts.map((account) => ({
			selected: selectedAccount?.id === account.id,
			onclick: () => {
				if (selectedAccount?.id === account.id) {
					selectedAccount = undefined;
				} else {
					selectedAccount = account;
				}
			},
			cells: [
				{ label: '' },
				{ label: account.organizationName || account.username || 'Vivent' },
				{ label: account.email }
			]
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

{#snippet title()}
	<Stack
		direction="horizontal"
		alignItems="center"
		justifyContent="space-between"
		style={{ width: '100%' }}
	>
		Earmark Devices
		<Stack direction="horizontal" alignItems="center" gap="0.5rem">
			<SearchBar />
			<Button
				icon="link"
				disabled={selectedDevices.size === 0}
				padding
				backgroundColor="var(--light-grey)"
				onclick={() => (assignDevices = !assignDevices)}
			>
				Assign {selectedDevices.size || ''} devices
			</Button>
		</Stack>
	</Stack>
{/snippet}

{#snippet actionPanel()}
	<Table
		headers={[
			{ label: '', width: '10%' },
			{ label: 'Organisation', width: '45%' },
			{ label: 'Email', width: '45%' }
		]}
		rows={rowsWithRenderHandler(accountsRows, selectCell)}
		pageSize={10}
	/>

	<Validation
		validateLabel={`Assign ${selectedDevices.size} devices`}
		validateDisabled={!selectedAccount}
		onvalidate={() => {
			if (selectedAccount) {
				updateDevices(
					Array.from(selectedDevices).map((it) => ({ ...it, accountId: selectedAccount?.id }))
				);

				selectedDevices = new Set();
				selectedAccount = undefined;
				assignDevices = false;
			}
		}}
		oncancel={() => {
			assignDevices = false;
		}}
	/>
{/snippet}

{#snippet actionPanelLabel()}
	<Stack direction="horizontal" justifyContent="space-between" style={{ width: '100%' }}>
		<span>Assign devices</span>
		<SearchBar />
	</Stack>
{/snippet}

<PageLayout
	actionPanel={assignDevices && selectedDevices.size > 0 ? actionPanel : undefined}
	label={actionPanelLabel}
>
	<Section fill>
		<PageHeader {title} subTitle={`${devicesRows.length} Available Devices`} />
		<Table
			style={getCss({ width: '100%' })}
			headers={[
				{ label: '', width: '5%' },
				{ label: 'ID', width: '40%' },
				{ label: 'Firmware Version', width: '20%' },
				{ label: 'Creation Date' }
			]}
			rows={rowsWithRenderHandler(devicesRows, selectCell)}
			pageSize={20}
		/>
	</Section>
</PageLayout>
