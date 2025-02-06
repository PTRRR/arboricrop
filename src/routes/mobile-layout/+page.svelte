<script lang="ts">
	import Button from '../../components/mobile-layout/Button.svelte';
	import Card from '../../components/mobile-layout/Card.svelte';
	import Section from '../../components/mobile-layout/Section.svelte';
	import TextInput from '../../components/mobile-layout/TextInput.svelte';
	import { useDevices, useFields, useNotifications } from '../../stores';
	import { getCss } from '../../utils/css';
	import CenteredWrapper from '../../components/mobile-layout/CenteredWrapper.svelte';
	import PageHeader from '../../components/mobile-layout/PageHeader.svelte';
	import StatusDot from '../../components/mobile-layout/StatusDot.svelte';
	import { shuffle } from '../../utils/arrays';
	import NotificationCard from '../../components/mobile-layout/NotificationCard.svelte';
	import ActionMenu from '../../components/mobile-layout/ActionMenu.svelte';
	import SaveMenu from '../../components/mobile-layout/SaveMenu.svelte';
	import { goto } from '$app/navigation';

	const { devices } = useDevices();
	const { fields } = useFields();
	const notifications = useNotifications();
	let newFieldName = $state<string | number>('');

	const selectedNotifications = $derived(
		shuffle($notifications).slice(0, Math.floor(Math.random() * 3 + 1))
	);

	const getFieldDeviceCount = (fieldId: string) => {
		return $devices.filter((it) => it.fieldId === fieldId).length;
	};
</script>

{#if $fields.length === 0}
	<PageHeader title="Create field" description="You don't have any field yet" />
	<Section>
		<TextInput label="Name" onvalue={(name) => (newFieldName = name)} />

		{#if newFieldName}
			<SaveMenu onsave={() => goto(`/mobile-layout/fields/new/?name=${newFieldName}`)} />
		{/if}
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
