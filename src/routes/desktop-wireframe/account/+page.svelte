<script>
	import { goto } from '$app/navigation';
	import AlertDialog from '../../../components/AlertDialog.svelte';
	import Button from '../../../components/Button.svelte';
	import Info from '../../../components/Info.svelte';
	import Input from '../../../components/Input.svelte';
	import Separation from '../../../components/Separation.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import ButtonList from '../../../components/wireframe/ButtonList.svelte';
	import SaveSection from '../../../components/wireframe/SaveSection.svelte';
	import { useInvitedUsers, useIsOrganisation, useOrganisationName } from '../../../stores';

	const isOrganisation = useIsOrganisation();
	const organisationName = useOrganisationName();
	const invitedUsers = useInvitedUsers();

	let currentEmail = '';
</script>

<div class="account">
	{#if $isOrganisation}
		<Separation title="Organisation settings:" />
		<Info label="Name:" />
		<Spacer />
		<Input
			placeholder="Organisation name"
			value={$organisationName}
			onValue={(value) => organisationName.set(value)}
		/>
		<Spacer />
		<Separation title="Users:" />
		{#if $invitedUsers.length > 0}
			<ButtonList items={$invitedUsers} let:item>
				<span>{item}</span>
			</ButtonList>
			<Spacer />
		{/if}
		<AlertDialog
			triggerLabel="Invite user"
			actionLabel="Invite"
			cancelLabel="Cancel"
			onAction={() => {
				invitedUsers.set([...$invitedUsers, currentEmail].filter((it) => it));
				currentEmail = '';
			}}
			onCancel={() => (currentEmail = '')}
		>
			<div class="account__invitation">
				<Separation title="Organisation settings:" />
				<Input placeholder="Email" onValue={(value) => (currentEmail = value)} />
			</div>
		</AlertDialog>
	{/if}

	<Spacer />
	<Separation title="Account type:" />

	{#if $isOrganisation}
		<Button
			on:click={() => {
				isOrganisation.set(false);
				organisationName.set('');
				invitedUsers.set([]);
			}}
		>
			Delete organisation
		</Button>
	{:else}
		<Button on:click={() => isOrganisation.set(true)}>Turn account into an organisation</Button>
	{/if}

	<Spacer />
	<Spacer />
	<Spacer />
	<Separation />
	<Spacer />
	<Spacer />
	<SaveSection
		onSave={() => {
			goto('/desktop-wireframe');
		}}
		onCancel={() => {
			goto('/desktop-wireframe');
		}}
	/>
</div>

<style>
	.account {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.account__invitation {
		display: flex;
		flex-direction: column;
		min-width: 30rem;
	}
</style>
