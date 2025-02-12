<script lang="ts">
	import Button from '../../components/mobile-layout/Button.svelte';
	import Card from '../../components/mobile-layout/Card.svelte';
	import Section from '../../components/mobile-layout/Section.svelte';
	import TextInput from '../../components/layout/TextInput.svelte';
	import {
		useDevices,
		useFields,
		useNotifications,
		useOrganisation,
		useOrganisations,
		useReturnButton,
		useUser
	} from '../../stores';
	import PageHeader from '../../components/mobile-layout/PageHeader.svelte';
	import { shuffle } from '../../utils/arrays';
	import NotificationCard from '../../components/mobile-layout/NotificationCard.svelte';
	import SaveMenu from '../../components/mobile-layout/SaveMenu.svelte';
	import { goto } from '$app/navigation';
	import ActionMenu from '../../components/mobile-layout/ActionMenu.svelte';
	import Table from '../../components/layout/Table.svelte';

	const { devices } = useDevices();
	const { fields } = useFields();
	const notifications = useNotifications();
	const { email } = useUser();
	const { organisations } = useOrganisations();
	const organisation = useOrganisation();

	let newEmail = $state('');
	let newFieldName = $state<string>('');
	let newSelectedOrganisation = $state($organisation);

	const returnButton = useReturnButton();
	returnButton.set({
		label: 'vita/hub'
	});

	const selectedNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 3 + 1))
	);

	const getFieldDeviceCount = (fieldId: string) => {
		return $devices.filter((it) => it.fieldId === fieldId).length;
	};

	const stage = $derived(
		!$email
			? 'login'
			: $organisations.length > 0 && typeof $organisation === 'undefined'
				? 'select-organisation'
				: $fields.length === 0
					? 'new-field'
					: 'final'
	);
</script>

{#if stage === 'login'}
	<PageHeader title="Login" />
	<Section>
		<TextInput label="Email" bind:value={newEmail} />
		<TextInput label="Password" type="password" />
		<Button icon="navigate">Sign Up</Button>
		<SaveMenu hidden={!newEmail} onsave={() => ($email = newEmail)} />
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
{:else if stage === 'new-field'}
	<PageHeader title="Create field" description="You don't have any field yet" />
	<Section>
		<TextInput label="Name" bind:value={newFieldName} />
		<SaveMenu
			hidden={!newFieldName}
			onsave={() => goto(`/mobile-layout/fields/new/?name=${newFieldName}`)}
		/>
	</Section>
{:else}
	{#snippet notificationsTitle()}
		<span>Notifications</span>
		<Button href="/mobile-layout/notifications" icon="navigate" iconOrder="inverted" padding
			>All</Button
		>
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
			<NotificationCard {notification} />
		{/each}
	</Section>

	{#snippet fieldsHeader()}
		<span>Fields</span>
		<Button href="/mobile-layout/fields/new" icon="add" padding />
	{/snippet}

	<PageHeader title={fieldsHeader} />
	<Section>
		{#each $fields as field}
			<Card
				href={`/mobile-layout/fields/${field.id}`}
				imageUrl="/images/map.png"
				background={false}
			>
				<div class="home__info">
					<h3>{field.name}</h3>
					<p>Devices: {getFieldDeviceCount(field.id)}</p>
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
