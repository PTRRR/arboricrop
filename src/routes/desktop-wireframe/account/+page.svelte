<script>
	import { goto } from '$app/navigation';
	import AlertDialog from '../../../components/wireframe/AlertDialog.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
	import Info from '../../../components/wireframe/Info.svelte';
	import Input from '../../../components/wireframe/Input.svelte';
	import Separation from '../../../components/wireframe/Separation.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import ButtonList from '../../../components/wireframe/ButtonList.svelte';
	import SaveSection from '../../../components/wireframe/SaveSection.svelte';
	import {
		useInvitedUsers,
		useIsOrganisation,
		useOrganisationName,
		useOrganisations
	} from '../../../stores';

	const { addOrganisation, deleteOrganisation } = useOrganisations();
	const organisationName = useOrganisationName();
	const isOrganisation = useIsOrganisation();
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
			onValue={(value) => ($organisationName = value)}
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
				if ($organisationName) {
					deleteOrganisation($organisationName);
				}
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
			if (organisationName) {
				addOrganisation($organisationName);
			}
			goto('/desktop-wireframe/dashboard');
		}}
		onCancel={() => {
			if (!$organisationName) {
				$isOrganisation = false;
				$organisationName = '';
			}
			goto('/desktop-wireframe/dashboard');
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
