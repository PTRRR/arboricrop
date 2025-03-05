<script lang="ts">
	import Button from '../../components/layout/Button.svelte';
	import Card from '../../components/mobile-layout/Card.svelte';
	import Section from '../../components/mobile-layout/Section.svelte';
	import TextInput from '../../components/layout/TextInput.svelte';
	import {
		useAccounts,
		useApp,
		useCurrentAccount,
		useDevices,
		useNotifications,
		useOrganisation,
		useOrganisations,
		useProjects,
		useReturnButton,
		useTrials,
		useUser
	} from '../../stores';
	import PageHeader from '../../components/layout/PageHeader.svelte';
	import { shuffle } from '../../utils/arrays';
	import NotificationCard from '../../components/mobile-layout/NotificationCard.svelte';
	import Map from '../../components/layout/Map.svelte';
	import Table from '../../components/layout/Table.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createId } from '@paralleldrive/cuid2';
	import Spacer from '../../components/Spacer.svelte';
	import { getCss } from '../../utils/css';
	import ActionMenu from '../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../components/mobile-layout/ActionButton.svelte';
	import type { Account, Marker, Trial } from '../../utils/types';
	import { changinCenter, swissBounds } from '../../utils/dummyData';
	import type { LngLatLike } from 'svelte-maplibre';
	import EmptyItem from '../../components/layout/EmptyItem.svelte';
	import Stack from '../../components/desktop/Stack.svelte';

	const { devices } = useDevices();
	const { trials } = useTrials();
	const { projects } = useProjects();
	const notifications = useNotifications();
	const { email } = useUser();
	const { isOffline } = useApp();
	const { organisations } = useOrganisations();
	const organisation = useOrganisation();
	const { accounts, addAccount } = useAccounts();
	const { currentAccount } = useCurrentAccount();
	const accountTrials = $derived($trials.filter((it) => it.accountId === $currentAccount?.id));
	const accountDevices = $derived($devices.filter((it) => it.accountId === $currentAccount?.id));

	const devicesMarkers = $derived<Marker[]>(
		accountDevices.map((device) => ({
			lngLat: (device.location || []) as LngLatLike,
			label: device.name,
			status: device.status,
			battery: device.battery
		}))
	);

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let newEmail = $state('');
	let password = $state('');
	let newTrialName = $state<string>('');
	let newSelectedOrganisation = $state($organisation);
	let resetPasswordStage = $state<'email' | 'password' | undefined>(undefined);

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

	const getTrialProject = (trial: Trial) => {
		return $projects.find((it) => it.id === trial.parentId);
	};

	const stage = $derived(
		resetPasswordStage === 'email'
			? 'enter-email'
			: resetPasswordStage === 'password'
				? 'enter-password'
				: !$email || !$currentAccount
					? 'login'
					: $organisations.length > 0 && typeof $organisation === 'undefined'
						? 'select-organisation'
						: 'final'
	);

	const loginHref = $derived(
		undefined
		// $organisations.length === 0 ? `${data.baseUrl}/trials/new` : undefined
	);

	onMount(() => {
		newEmail = $accounts[0].email;
	});
</script>

{#if stage === 'enter-email'}
	<Section>
		<PageHeader title="Reset Password" />
		<TextInput label="email" />
		<Button icon="forward" onclick={() => (resetPasswordStage = 'password')}>Send</Button>
	</Section>
{:else if stage === 'enter-password'}
	<Section>
		<PageHeader title="Reset Password" />
		<TextInput type="password" label="New Password" />
		<TextInput type="password" label="Repeat Password" />
		<Button icon="forward" onclick={() => (resetPasswordStage = undefined)}>Reset</Button>
	</Section>
{:else if stage === 'login'}
	<Section>
		<PageHeader title="Login" />
		<TextInput label="Email" bind:value={newEmail} />
		<TextInput label="Password" type="password" bind:value={password} />
		<Spacer />
		<span style={getCss({ color: 'var(--grey)' })}>Forgot your password?</span>
		<Button icon="forward" onclick={() => (resetPasswordStage = 'email')}>Reset</Button>
	</Section>

	{#if newEmail && password}
		<ActionMenu>
			<ActionButton
				icon="check"
				href={loginHref}
				onclick={() => {
					$email = newEmail;

					const account = $accounts.find((it) => it.email === newEmail);

					if (!account) {
						const newAccount: Account = {
							id: `acc-${createId()}`,
							email: newEmail,
							role: 'Viv superadmin'
						};

						addAccount(newAccount);
						$currentAccount = newAccount;
					} else {
						$currentAccount = account;
					}
				}}
			>
				Login
			</ActionButton>
		</ActionMenu>
	{/if}
{:else if stage === 'select-organisation'}
	<Section>
		<PageHeader title="Select Organisation" />
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
	</Section>
{:else}
	{#if accountDevices.length > 0}
		<Section>
			<PageHeader title="All Devices" subTitle={`${accountDevices.length} Devices`} />
			<Map
				maxBounds={swissBounds}
				zoom={15}
				minZoom={3}
				maxZoom={18}
				center={changinCenter}
				markers={devicesMarkers}
			/>
		</Section>
	{/if}

	{#if !$isOffline}
		{#snippet notificationsTitle()}
			<Stack
				direction="horizontal"
				alignItems="center"
				style={{ width: '100%' }}
				justifyContent="space-between"
			>
				<span>Notifications</span>
				<Button href={`${data.baseUrl}/notifications`} icon="forward" iconOrder="inverted">
					All
				</Button>
			</Stack>
		{/snippet}

		{#snippet notificationsSubTitle()}
			<div class="home__notifications-subtitle">
				<span
					>{selectedNotifications.length}
					{selectedNotifications.length > 1 ? 'Issues' : 'Issue'}</span
				>
			</div>
		{/snippet}

		<Section>
			<PageHeader title={notificationsTitle} subTitle={notificationsSubTitle} />
			{#each selectedNotifications as notification}
				<NotificationCard {notification} baseUrl={data.baseUrl} />
			{/each}
		</Section>
	{/if}

	{#snippet fieldsHeader()}
		<Stack
			direction="horizontal"
			alignItems="center"
			style={{ width: '100%' }}
			justifyContent="space-between"
		>
			<span>Trials</span>
			<Button href={`${data.baseUrl}/trials`} icon="forward" iconOrder="inverted">All</Button>
			<!-- <Button href={`${data.baseUrl}/trials/new`} icon="add" padding /> -->
		</Stack>
	{/snippet}

	<Section>
		<PageHeader title={fieldsHeader} />

		{#if accountTrials.length > 0}
			{#each accountTrials.slice(0, 5) as trial}
				<Card
					href={`${data.baseUrl}/trials/${trial.id}`}
					imageUrl="/images/map.png"
					background={true}
				>
					<div class="home__info" style={getCss({ textTransform: 'lowercase' })}>
						<h3>{trial.name}</h3>
						<p>{getTrialProject(trial)?.name}</p>
						<!-- <p>{`${getTrialDeviceCount(trial.id)} Devices`}</p> -->
					</div>
				</Card>
			{/each}
		{:else}
			<EmptyItem label="No trials found" />
		{/if}
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
				// color: var(--dark-grey);
			}
		}

		&__notifications-subtitle {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}
</style>
