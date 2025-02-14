<script lang="ts">
	import Button from '../../components/layout/Button.svelte';
	import Card from '../../components/mobile-layout/Card.svelte';
	import Section from '../../components/mobile-layout/Section.svelte';
	import TextInput from '../../components/layout/TextInput.svelte';
	import {
		useAccounts,
		useCurrentAccount,
		useDevices,
		useNotifications,
		useOrganisation,
		useOrganisations,
		useReturnButton,
		useTrials,
		useUser
	} from '../../stores';
	import PageHeader from '../../components/layout/PageHeader.svelte';
	import { shuffle } from '../../utils/arrays';
	import NotificationCard from '../../components/mobile-layout/NotificationCard.svelte';
	import SaveMenu from '../../components/mobile-layout/SaveMenu.svelte';
	import { goto } from '$app/navigation';
	import Table from '../../components/layout/Table.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createId } from '@paralleldrive/cuid2';

	const { devices } = useDevices();
	const { trials } = useTrials();
	const notifications = useNotifications();
	const { email } = useUser();
	const { organisations } = useOrganisations();
	const organisation = useOrganisation();
	const { accounts, addAccount } = useAccounts();
	const { currentAccount } = useCurrentAccount();
	const accountTrials = $derived($trials.filter((it) => it.accountId === $currentAccount?.id));

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let newEmail = $state('');
	let newTrialName = $state<string>('');
	let newSelectedOrganisation = $state($organisation);

	const returnButton = useReturnButton();
	returnButton.set({
		label: 'vita/hub',
		href: data.baseUrl
	});

	const selectedNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 3 + 1))
	);

	const getTrialDeviceCount = (trialId: string) => {
		return $devices.filter((it) => it.parentId === trialId).length;
	};

	const stage = $derived(
		!$email
			? 'login'
			: $organisations.length > 0 && typeof $organisation === 'undefined'
				? 'select-organisation'
				: accountTrials.length === 0
					? 'new-trial'
					: 'final'
	);

	onMount(() => {
		newEmail = $accounts[0].email;
	});
</script>

{#if stage === 'login'}
	<PageHeader title="Login" />
	<Section>
		<TextInput label="Email" bind:value={newEmail} />
		<TextInput label="Password" type="password" />
		<Button icon="navigate">Sign Up</Button>
		<SaveMenu
			hidden={!newEmail}
			onsave={() => {
				$email = newEmail;

				const account = $accounts.find((it) => it.email === newEmail);

				if (!account) {
					const newAccount = {
						id: `acc-${createId()}`,
						email: newEmail
					};

					addAccount(newAccount);
					$currentAccount = newAccount;
				} else {
					$currentAccount = account;
				}
			}}
		/>
	</Section>
{:else if stage === 'select-organisation'}
	<PageHeader title="Select Organisation" />
	<Section>
		<Table
			headers={[{ label: 'Name' }]}
			rows={[
				{
					onclick: () => (newSelectedOrganisation = null),
					cells: [{ label: 'None' }]
				},
				...$organisations.map((it) => ({
					onclick: () => (newSelectedOrganisation = it),
					selected: newSelectedOrganisation === it,
					cells: [{ label: it }]
				}))
			]}
		/>
		<SaveMenu
			hidden={typeof newSelectedOrganisation === 'undefined'}
			onsave={() => ($organisation = newSelectedOrganisation)}
		/>
	</Section>
{:else if stage === 'new-trial'}
	<PageHeader title="Create trial" description="You don't have any trial yet" />
	<Section>
		<TextInput label="Name" bind:value={newTrialName} />
		<SaveMenu
			hidden={!newTrialName}
			onsave={() => goto(`${data.baseUrl}/trials/new/?name=${newTrialName}`)}
		/>
	</Section>
{:else}
	{#snippet notificationsTitle()}
		<span>Notifications</span>
		<Button href={`${data.baseUrl}/notifications`} icon="navigate" iconOrder="inverted" padding>
			All
		</Button>
	{/snippet}

	{#snippet notificationsSubTitle()}
		<div class="home__notifications-subtitle">
			<span
				>{selectedNotifications.length}
				{selectedNotifications.length > 1 ? 'Issues' : 'Issue'}</span
			>
		</div>
	{/snippet}

	<PageHeader title={notificationsTitle} subTitle={notificationsSubTitle} />
	<Section>
		{#each selectedNotifications as notification}
			<NotificationCard {notification} baseUrl={data.baseUrl} />
		{/each}
	</Section>

	{#snippet fieldsHeader()}
		<span>Trials</span>
		<Button href={`${data.baseUrl}/trials/new`} icon="add" padding />
	{/snippet}

	<PageHeader title={fieldsHeader} />
	<Section>
		{#each accountTrials as trial}
			<Card
				href={`${data.baseUrl}/trials/${trial.id}`}
				imageUrl="/images/map.png"
				background={false}
			>
				<div class="home__info">
					<h3>{trial.name}</h3>
					<p>Devices: {getTrialDeviceCount(trial.id)}</p>
				</div>
			</Card>
		{/each}
	</Section>
{/if}

<style lang="scss">
	.home {
		&__info {
			display: flex;
			flex-direction: column;

			h3 {
				font-size: var(--mid-font-size);
			}

			p {
				font-weight: normal;
				color: var(--dark-grey);
			}
		}

		&__notifications-subtitle {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}
</style>
