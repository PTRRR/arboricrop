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
		<Button
			href={`/mobile-layout/fields/new/?name=${newFieldName}`}
			disabled={!newFieldName}
			fitWidth
		>
			Create
		</Button>
	</Section>
{:else}
	{#snippet notificationsTitle()}
		<span>Notifications</span>
		<Button href="/mobile-layout/notifications" icon="navigate" iconOrder="inverted">All</Button>
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
		<Button href="/mobile-layout/fields/new" icon="add" />
	{/snippet}

	<PageHeader title={fieldsHeader} />
	<Section>
		{#each $fields as field}
			<Card href={`/mobile-layout/fields/${field.id}`} imageUrl="/images/map.png">
				<div class="home__info">
					<p>Name: {field.name}</p>
					<p style={getCss({ fontWeight: 'normal' })}>
						Devices: {getFieldDeviceCount(field.id)}
					</p>
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
			gap: 0.1rem;
		}

		&__notifications-subtitle {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}
</style>
