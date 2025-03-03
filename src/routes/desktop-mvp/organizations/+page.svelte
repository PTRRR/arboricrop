<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import type { Row } from '../../../components/layout/Table.svelte';
	import Table from '../../../components/layout/Table.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import { useAccounts } from '../../../stores';
	import type { Account, RoleName } from '../../../utils/types';
	import Dropdown from '../../../components/desktop/Dropdown.svelte';
	import DangerZone from '../../../components/desktop/DangerZone.svelte';
	import Grid from '../../../components/desktop/Grid.svelte';
	import OrganizationCard from '../../../components/desktop/OrganizationCard.svelte';
	import Pagination from '../../../components/layout/Pagination.svelte';

	const { accounts, addAccount } = useAccounts();

	const accountsRows = $derived<Row[]>(
		$accounts.map((account) => ({
			selected: account.id === selectedOrganization?.id,
			onclick: () =>
				(selectedOrganization = selectedOrganization?.id === account.id ? undefined : account),
			cells: [
				{ label: account.organizationName || account.username || 'Unknown' },
				{ label: account.email }
			]
		}))
	);

	let newAccount: Account | undefined = $state(undefined);
	let selectedOrganization = $state<Account | undefined>(undefined);
	let searchQuery = $state('');
	let isOrganisation = $state(false);

	const filteredOrganizations = $derived(
		$accounts.filter((it) =>
			searchQuery
				? it.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					it.username?.toLowerCase().includes(searchQuery.toLowerCase())
				: true
		)
	);
</script>

{#snippet title()}
	<Stack
		direction="horizontal"
		alignItems="center"
		justifyContent="space-between"
		style={{ width: '100%' }}
	>
		Organizations
		{#if !newAccount && !selectedOrganization}
			<Button
				icon="add"
				padding
				backgroundColor="var(--light-grey)"
				onclick={() => {
					newAccount = {
						id: createId(),
						username: '',
						email: '',
						role: 'Farmer'
					};
				}}
			>
				Create
			</Button>
		{/if}
	</Stack>
{/snippet}

{#snippet roleSnippet(item: { label: RoleName })}
	<Button
		backgroundColor="var(--white)"
		padding
		onclick={() => {
			if (newAccount) {
				newAccount.role = item.label;
			}
		}}
	>
		{item.label}
	</Button>
{/snippet}

<Stack direction="horizontal" style={{ width: '100%' }}>
	<Section>
		<PageHeader {title} />
		<SearchBar bind:value={searchQuery} />
		<Grid>
			{#each filteredOrganizations as organization}
				<OrganizationCard {organization} />
			{/each}
		</Grid>
		<!-- <Table
			headers={[
				{ label: 'Organisation', width: '35%' },
				{ label: 'Email', width: '45%' }
			]}
			rows={accountsRows}
			pageSize={30}
		/> -->
		<Pagination pages={3} />
	</Section>

	{#if newAccount}
		<Section label="New Organization" width="40%" backgroundColor="var(--light-grey)">
			<TextInput
				label="Organization Name"
				onvalue={(value) => {
					if (!newAccount) return;
					newAccount.organizationName = value;
				}}
			/>
			<TextInput
				label="Email"
				onvalue={(value) => {
					if (!newAccount) return;
					newAccount.email = value;
				}}
			/>
			<TextInput
				type="password"
				label="Password"
				onvalue={(value) => {
					if (!newAccount) return;
					newAccount.password = value;
				}}
			/>
			<TextInput type="password" label="Repeat Password" />

			<!-- <Stack gap="1rem">
				<span>Select role</span>
				<Dropdown
					label={newAccount.role || 'Role'}
					icon="navigate"
					items={[
						{ label: 'Viv superadmin' },
						{ label: 'Distributer' },
						{ label: 'Farmer Admin' },
						{ label: 'Farmer' }
					]}
					itemSnippet={roleSnippet}
				/>
			</Stack> -->

			<!-- <Spacer />
			<div>
				<p>Is Organisation</p>
				<Spacer size="0.5rem" />
				<Checkbox onChange={(checked) => (isOrganisation = checked)} />
			</div>

			{#if isOrganisation}
				<TextInput
					label="Organization Name"
					onvalue={(value) => {
						if (!newAccount) return;
						newAccount.organizationName = value;
					}}
				/>
			{/if} -->

			<Validation
				validateDisabled={!newAccount.email || !newAccount.organizationName || !newAccount.password}
				validateLabel="Create"
				onvalidate={() => {
					if (!newAccount) return;
					addAccount(newAccount);
					newAccount = undefined;
				}}
				oncancel={() => {
					isOrganisation = false;
					newAccount = undefined;
				}}
			/>
		</Section>
	{:else if selectedOrganization}
		{#key selectedOrganization.id}
			<Section label="Edit organisation" width="40%" backgroundColor="var(--light-grey)">
				<TextInput label="Organization Name" defaultValue={selectedOrganization.organizationName} />
				<TextInput label="Email" defaultValue={selectedOrganization.email} />
				<Validation
					validateLabel="Save"
					onvalidate={() => (selectedOrganization = undefined)}
					cancelLabel="Cancel"
					oncancel={() => (selectedOrganization = undefined)}
				/>
				<DangerZone
					label="Delete Organization"
					description="Permanently delete this organization and all of its data. This action cannot be undone."
				/>
			</Section>
		{/key}
	{/if}
</Stack>
