<script lang="ts">
	import Dropdown from '../../../components/desktop/Dropdown.svelte';
	import PageLayout from '../../../components/desktop/PageLayout.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Section from '../../../components/desktop/Section.svelte';
	import SectionLabel from '../../../components/desktop/SectionLabel.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import type { Cell, Row } from '../../../components/layout/Table.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import { useAccounts } from '../../../stores';
	import { getCss } from '../../../utils/css';
	import type { Account, RoleName } from '../../../utils/types';

	const { accounts } = useAccounts();
	const organisations = $derived($accounts.filter((it) => it.organizationName));

	let selectedAccount = $state<Account | undefined>(undefined);
	const roles: RoleName[] = ['Distributer', 'Farmer', 'Farmer Admin'];

	const accountsRows = $derived<Row[]>(
		$accounts.map((account) => ({
			selected: selectedAccount?.id === account.id,
			onclick: () => {
				selectedAccount = selectedAccount?.id !== account.id ? account : undefined;
			},
			cells: [
				{ label: '', renderHandler: selectCell },
				{ label: account.email },
				{ label: account.organizationName || account.username || 'Vivent' },
				{ label: account.role }
			]
		}))
	);
</script>

{#snippet title()}
	<Stack
		direction="horizontal"
		alignItems="center"
		justifyContent="space-between"
		style={{ width: '100%' }}
	>
		Users
		<Stack direction="horizontal" gap="0.5rem" alignItems="center">
			<SearchBar />
			<Button icon="add" padding backgroundColor="var(--light-grey)" onclick={() => {}}>
				Create
			</Button>
		</Stack>
	</Stack>
{/snippet}

{#snippet selectCell(cell: Cell, row?: Row)}
	<div style={getCss({ padding: '0 0 0 0.5rem', pointerEvents: 'none' })}>
		{#if row?.selected}
			<Checkbox raw initialChecked />
		{:else}
			<Checkbox raw />
		{/if}
	</div>
{/snippet}

{#snippet actionPanelLabel()}
	{#if selectedAccount}
		<SectionLabel label="Update User">
			<Validation
				validateLabel="Save"
				onvalidate={() => {}}
				oncancel={() => (selectedAccount = undefined)}
			/>
		</SectionLabel>
	{/if}
{/snippet}

{#snippet actionPanel()}
	{#if selectedAccount}
		<TextInput label="Email" value={selectedAccount.email} />
		<Dropdown
			items={roles}
			backgroundColor="var(--grey)"
			icon="admin"
			gap="0.5rem"
			padding
			sameWidth={true}
		>
			{#snippet label()}
				{selectedAccount?.role}
			{/snippet}
			{#snippet itemSnippet(role)}
				<Button
					padding="0.3rem"
					icon={role === 'Farmer Admin' ? 'admin' : role === 'Distributer' ? 'user' : 'warehouse'}
					onclick={() => {}}
				>
					{role}
				</Button>
			{/snippet}
		</Dropdown>

		<Dropdown
			items={organisations.slice(0, 5)}
			backgroundColor="var(--grey)"
			icon="corporate"
			gap="0.5rem"
			padding
			sameWidth={true}
		>
			{#snippet label()}
				{selectedAccount?.organizationName}
			{/snippet}
			{#snippet prefixSnippet()}
				<SearchBar maxWidth="100%" />
			{/snippet}
			{#snippet itemSnippet(organisation)}
				<Button padding="0.3rem" onclick={() => {}}>
					{organisation.organizationName}
				</Button>
			{/snippet}
		</Dropdown>
	{/if}
{/snippet}

<PageLayout label={actionPanelLabel} actionPanel={selectedAccount && actionPanel}>
	<Section>
		<PageHeader {title} />

		<Table
			headers={[
				{ label: '', width: '10%' },
				{ label: 'Email', width: '30%', sortable: true },
				{ label: 'Organisation', width: '30%', sortable: true },
				{ label: 'Role', width: '30%', sortable: true }
			]}
			rows={accountsRows}
			pageSize={15}
		/>
	</Section>
</PageLayout>
