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

	const { accounts, addAccount } = useAccounts();

	const accountsRows = $derived<Row[]>(
		$accounts.map((account) => ({
			cells: [
				{ label: account.organizationName || account.username || 'Unknown' },
				{ label: account.email },
				{ label: account.role || 'Viv superadmin' }
			]
		}))
	);

	let newAccount: Account | undefined = $state(undefined);
	let isOrganisation = $state(false);
</script>

{#snippet title()}
	<Stack
		direction="horizontal"
		alignItems="center"
		justifyContent="space-between"
		style={{ width: '100%' }}
	>
		Customer Accounts
		{#if !newAccount}
			<Button
				icon="add"
				iconOrder="inverted"
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
		<SearchBar />
		<Table
			headers={[
				{ label: 'Organisation', width: '35%' },
				{ label: 'Email', width: '45%' },
				{ label: 'Role', width: '10%' }
			]}
			rows={accountsRows}
			pageSize={30}
		/>
	</Section>

	{#if newAccount}
		<Section label="Account creation" width="40%" backgroundColor="var(--light-grey)">
			<TextInput
				label="Username"
				onvalue={(value) => {
					if (!newAccount) return;
					newAccount.username = value;
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

			<Stack gap="1rem">
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
			</Stack>

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
				validateDisabled={!newAccount.email || !newAccount.username || !newAccount.password}
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
	{/if}
</Stack>
