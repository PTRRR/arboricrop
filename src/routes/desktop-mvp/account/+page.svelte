<script lang="ts">
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Section from '../../../components/desktop/Section.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import Button from '../../../components/layout/Button.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import Pagination from '../../../components/layout/Pagination.svelte';
	import Table, { type Cell, type Row } from '../../../components/layout/Table.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import Checkbox from '../../../components/mobile-layout/Checkbox.svelte';
	import Icon from '../../../components/mobile-layout/Icon.svelte';
	import { useAccounts, useCurrentAccount } from '../../../stores';
	import { getCss } from '../../../utils/css';

	const { currentAccount } = useCurrentAccount();
	const { accounts, updateAccount } = useAccounts();

	const invitedAccounts = $derived(
		$accounts.filter((it) => $currentAccount?.invitedAccounts?.includes(it.id))
	);
	let inviteAccounts = $state(false);
	let newInvitedAccounts = $state<Set<string>>(new Set());
</script>

{#if $currentAccount}
	{#snippet checkbox(cell: Cell, row?: Row)}
		{#if row?.selected}
			<Checkbox raw initialChecked />
		{:else}
			<Checkbox raw />
		{/if}
	{/snippet}

	{#snippet title()}
		<Stack direction="horizontal" style={{ width: '100%' }} justifyContent="space-between">
			<span>Account</span>
			<Validation validateLabel="Save" onvalidate={() => {}} />
		</Stack>
	{/snippet}

	<Stack style={{ width: '100%' }} direction="horizontal">
		<Stack style={{ width: '100%' }}>
			<Section>
				<PageHeader {title} subTitle={$currentAccount.email} />
			</Section>

			<Section label="Settings" style={{ maxWidth: '40rem' }}>
				<TextInput label="Username" defaultValue="Jon" />
				<TextInput label="Email" defaultValue={$currentAccount.email} />

				<Stack>
					<TextInput label="Password" />
					<!-- svelte-ignore a11y_invalid_attribute -->
					<a href="#" style={getCss({ textDecoration: 'underline', color: 'black' })}>
						Reset Password
					</a>
				</Stack>
			</Section>

			<!-- <Section label="Organisation" style={{ maxWidth: '40rem' }}>
				<TextInput label="Organisation Name" defaultValue={$currentAccount.organizationName} />

				{#if invitedAccounts.length > 0}
					<Stack>
						<p>Invited accounts</p>
						<Table
							headers={[{ label: '', width: '3rem' }, { label: 'Email' }]}
							rows={invitedAccounts.slice(0, 15).map((account) => ({
								onclick: () => {
									if (newInvitedAccounts.has(account.id)) {
										newInvitedAccounts.delete(account.id);
									} else {
										newInvitedAccounts.add(account.id);
									}

									newInvitedAccounts = new Set(newInvitedAccounts);
								},
								selected: newInvitedAccounts.has(account.id),
								cells: [{ label: '', renderHandler: checkbox }, { label: account.email }]
							}))}
						/>
					</Stack>
				{/if}

				{#if !inviteAccounts}
					<Button icon="add" onclick={() => (inviteAccounts = true)}>Invite Users</Button>
				{/if}
			</Section> -->
		</Stack>

		{#if inviteAccounts}
			<Section
				label="Invite users"
				backgroundColor="var(--light-grey)"
				sticky="var(--content-offset-top)"
			>
				<SearchBar />
				<Table
					headers={[{ label: '', width: '3rem' }, { label: 'Email' }]}
					rows={$accounts
						.filter((it) => !invitedAccounts.map((it) => it.id).includes(it.id))
						.slice(0, 15)
						.map((account) => ({
							onclick: () => {
								if (newInvitedAccounts.has(account.id)) {
									newInvitedAccounts.delete(account.id);
								} else {
									newInvitedAccounts.add(account.id);
								}

								newInvitedAccounts = new Set(newInvitedAccounts);
							},
							selected: newInvitedAccounts.has(account.id),
							cells: [{ label: '', renderHandler: checkbox }, { label: account.email }]
						}))}
				/>
				<Pagination pages={3} />
				<Validation
					validateLabel="Invite"
					onvalidate={() => {
						if (!$currentAccount) return;

						const newInvitedAccountsIds = [
							...($currentAccount.invitedAccounts || []),
							...Array.from(newInvitedAccounts)
						];

						updateAccount({
							...$currentAccount,
							invitedAccounts: newInvitedAccountsIds
						});

						$currentAccount = $accounts.find((it) => it.id === $currentAccount?.id);

						newInvitedAccounts = new Set();
						inviteAccounts = false;
					}}
					oncancel={() => {
						inviteAccounts = false;
					}}
				/>
			</Section>
		{/if}
	</Stack>
{/if}
