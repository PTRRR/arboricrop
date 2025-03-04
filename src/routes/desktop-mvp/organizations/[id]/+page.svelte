<script lang="ts">
	import { page } from '$app/state';
	import DangerZone from '../../../../components/desktop/DangerZone.svelte';
	import Dropdown from '../../../../components/desktop/Dropdown.svelte';
	import PageLayout from '../../../../components/desktop/PageLayout.svelte';
	import SearchBar from '../../../../components/desktop/SearchBar.svelte';
	import Section from '../../../../components/desktop/Section.svelte';
	import Stack from '../../../../components/desktop/Stack.svelte';
	import Validation from '../../../../components/desktop/Validation.svelte';
	import Button from '../../../../components/layout/Button.svelte';
	import EmptyItem from '../../../../components/layout/EmptyItem.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import Table, { type Cell } from '../../../../components/layout/Table.svelte';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import { useAccounts } from '../../../../stores';
	import { shuffle } from '../../../../utils/arrays';
	import type { Account, RoleName } from '../../../../utils/types';

	const { accounts, updateAccount } = useAccounts();
	const organizationId = page.params.id;
	const organization = $derived($accounts.find((it) => it.id === organizationId));
	const invitedAccounts = $derived($accounts.filter((it) => it.parentId === organizationId));
	const roles: RoleName[] = ['Distributer', 'Farmer', 'Farmer Admin'];

	let editOrganization = $state(false);

	let invitedUsers = $state<Map<string, Account>>(new Map());
	let selectedUser = $state<Account | undefined>(undefined);
	const showActionPanel = $derived(editOrganization || selectedUser || invitedUsers.size > 0);
	const actionPanelLabel = $derived(
		editOrganization
			? 'Edit Organization'
			: selectedUser
				? 'Edit User'
				: invitedUsers.size > 0
					? 'Invite Users'
					: undefined
	);
</script>

{#if organization}
	{#snippet preTitle()}
		<Button icon="back" iconSize="small" href="/desktop-mvp/organizations">Organizations</Button>
	{/snippet}

	{#snippet title()}
		<Stack
			direction="horizontal"
			style={{ width: '100%' }}
			alignItems="center"
			justifyContent="space-between"
		>
			{organization.username || organization.organizationName}
			<Button
				icon="edit"
				padding
				backgroundColor="var(--light-grey)"
				onclick={() => (editOrganization = true)}
			>
				Edit
			</Button>
		</Stack>
	{/snippet}

	{#snippet roleItem({ accountId, item }: { accountId: string; item: RoleName })}
		<Button
			padding="0.3rem"
			icon={item === 'Farmer Admin' ? 'admin' : item === 'Distributer' ? 'user' : 'warehouse'}
			onclick={() => {
				const acc = invitedUsers.get(accountId);
				if (acc) {
					invitedUsers.set(accountId, {
						...acc,
						role: item
					});
					invitedUsers = new Map(invitedUsers);
				}
			}}
		>
			{item}
		</Button>
	{/snippet}

	{#snippet roleDropdown({ label: accountId }: Cell)}
		<Dropdown
			small
			sameWidth={false}
			icon="arrow-down"
			label={accountId && invitedUsers.has(accountId)
				? invitedUsers.get(accountId)?.role || 'Select Role'
				: 'Select Role'}
			items={roles.map((it) => ({ accountId: accountId || '', item: it }))}
			itemSnippet={roleItem}
		/>
	{/snippet}

	{#snippet roleDropdownEdit({ role, accountId }: { role: string; accountId: string })}
		<Button padding backgroundColor="var(--white)">{role}</Button>
	{/snippet}

	{#snippet actionPanel()}
		{#if editOrganization}
			<TextInput label="organization name" defaultValue={organization.organizationName} />
			<TextInput label="email" defaultValue={organization.email} />
			<Validation
				validateLabel="save"
				onvalidate={() => (editOrganization = false)}
				oncancel={() => (editOrganization = false)}
			/>
			<DangerZone
				label="Delete organization"
				description="Permanently delete this organization and all of its data. This action cannot be undone."
			/>
		{:else if invitedUsers.size > 0}
			<TextInput label="email" />
			<div>
				<Button icon="add" padding backgroundColor="var(--white)">Add to list</Button>
			</div>
			<Table
				headers={[
					{ label: 'email', width: '40%' },
					{ label: 'role', width: '30%' },
					{ label: 'scope', width: '30%' }
				]}
				rows={Array.from(invitedUsers.values()).map((it, index) => {
					return {
						cells: [
							{ label: it.email },
							{ label: it.id, renderHandler: roleDropdown },
							{ label: `project${index.toString().padStart(2, '0')}` }
						]
					};
				})}
			/>
			<Validation
				validateLabel="send invitations"
				onvalidate={() => {
					invitedUsers
						.values()
						.forEach((account) => updateAccount({ ...account, parentId: organization.id }));
					editOrganization = false;
					invitedUsers = new Map();
				}}
				oncancel={() => (invitedUsers = new Map())}
			/>
		{:else if selectedUser}
			<TextInput label="email" readonly defaultValue={selectedUser.email} />

			<Stack gap="0.5rem" alignItems="flex-start">
				<p>Role</p>
				<Dropdown
					icon="down"
					iconOrder="inverted"
					label={selectedUser.role || 'Select Role'}
					items={roles.map((it) => ({ role: it, accountId: selectedUser?.id || '' }))}
					itemSnippet={roleDropdownEdit}
				/>
			</Stack>

			<Validation
				validateLabel="Save"
				onvalidate={() => (selectedUser = undefined)}
				oncancel={() => (selectedUser = undefined)}
			/>

			<DangerZone
				label="Remove user"
				description="Permanently remove this user from the organization. This action cannot be undone."
				onclick={() => {
					if (!selectedUser) return;
					updateAccount({ ...selectedUser, parentId: undefined });
					selectedUser = undefined;
				}}
			/>
		{/if}
	{/snippet}

	<PageLayout actionPanel={showActionPanel ? actionPanel : undefined} label={actionPanelLabel}>
		<Stack style={{ width: '100%' }}>
			<Section>
				<PageHeader {preTitle} {title} subTitle={organization.email} />
			</Section>
			<Section
				label="Users"
				actions={[
					{
						label: 'Invite',
						icon: 'add',
						padding: true,
						backgroundColor: 'var(--light-grey)',
						onclick: () => {
							shuffle($accounts)
								.slice(0, 4)
								.forEach((it) => invitedUsers.set(it.id, { ...it, role: 'Farmer Admin' }));

							invitedUsers = new Map(invitedUsers);
						}
					}
				]}
			>
				{#if invitedAccounts.length === 0}
					<EmptyItem label="There are no users yet" />
				{:else}
					<SearchBar />
					<Table
						headers={[
							{ label: 'email', width: '30%', sortable: true },
							{ label: 'role', width: '30%', sortable: true },
							{ label: 'scope', sortable: true }
						]}
						rows={invitedAccounts.map((it, index) => ({
							selected: selectedUser?.id === it.id,
							onclick: () => {
								if (selectedUser?.id === it.id) {
									selectedUser = undefined;
								} else {
									selectedUser = it;
								}
							},
							cells: [
								{ label: it.email },
								{ label: it.role },
								{ label: `project${index.toString().padStart(2, '0')}` }
							]
						}))}
					/>
				{/if}
			</Section>
		</Stack>
	</PageLayout>
{/if}
