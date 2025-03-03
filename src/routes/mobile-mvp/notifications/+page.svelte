<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../components/layout/Button.svelte';
	import { useNotifications, useReturnButton } from '../../../stores';
	import type { NotificationType } from '../../../utils/types';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import NotificationCard from '../../../components/mobile-layout/NotificationCard.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import type { LayoutData } from './$types';
	import Stack from '../../../components/desktop/Stack.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';

	interface Props {
		data: LayoutData;
	}

	const { data }: Props = $props();

	const returnButton = useReturnButton();
	const notifications = useNotifications();

	const filter = $derived($page.data.filter as NotificationType);
	const aknowledgedNotifications = $derived(
		$notifications.filter((it) => it.status !== 'acknowledged')
	);

	const filteredNotifications = $derived(
		filter ? aknowledgedNotifications.filter((it) => it.type === filter) : aknowledgedNotifications
	);

	returnButton.set({
		label: '',
		backHref: data.baseUrl
	});
</script>

<Section>
	<PageHeader title="Notifications" />
	<div class="notifications_filters">
		<Button
			padding="0.5rem"
			backgroundColor="var(--grey)"
			selected={filter === 'alert'}
			href={filter === 'alert'
				? window.location.pathname
				: `${window.location.pathname}?filter=alert`}
		>
			Alerts
		</Button>
		<Button
			padding="0.5rem"
			backgroundColor="var(--grey)"
			selected={filter === 'warning'}
			href={filter === 'warning'
				? window.location.pathname
				: `${window.location.pathname}?filter=warning`}
		>
			Warnings
		</Button>
		<Button
			padding="0.5rem"
			backgroundColor="var(--grey)"
			selected={filter === 'notification'}
			href={filter === 'notification'
				? window.location.pathname
				: `${window.location.pathname}?filter=notification`}
		>
			Notifications
		</Button>
	</div>

	<Stack gap="1rem">
		<TextInput />
		<Button icon="search">Search</Button>
	</Stack>
</Section>

<Section>
	{#each filteredNotifications as notification}
		<NotificationCard {notification} baseUrl={data.baseUrl} />
	{/each}
</Section>

<style>
	.notifications_filters {
		position: sticky;
		display: flex;
		gap: var(--gap);
		align-items: center;
	}
</style>
