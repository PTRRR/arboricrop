<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../components/mobile-layout/Button.svelte';
	import { useNotifications, useReturnButton } from '../../../stores';
	import type { NotificationType } from '../../../utils/types';
	import Section from '../../../components/mobile-layout/Section.svelte';
	import NotificationCard from '../../../components/mobile-layout/NotificationCard.svelte';
	import PageHeader from '../../../components/mobile-layout/PageHeader.svelte';

	const returnButton = useReturnButton();
	const notifications = useNotifications();

	$: filter = $page.data.filter as NotificationType;
	$: aknowledgedNotifications = $notifications.filter((it) => it.status !== 'acknowledged');

	$: filteredNotifications = filter
		? aknowledgedNotifications.filter((it) => it.type === filter)
		: aknowledgedNotifications;

	returnButton.set({
		label: '',
		backHref: '/mobile-layout'
	});
</script>

<PageHeader title="Notifications & Alerts" />

<Section>
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
</Section>

<Section>
	{#each filteredNotifications as notification}
		<NotificationCard {notification} />
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
