<script lang="ts">
	import { page } from '$app/stores';
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import Separation from '../../../components/wireframe/Separation.svelte';
	import { useNotifications, useReturnButton } from '../../../stores';
	import type { NotificationType } from '../../../utils/types';

	const returnButton = useReturnButton();
	const notifications = useNotifications();

	$: filter = $page.data.filter as NotificationType;
	$: aknowledgedNotifications = $notifications.filter((it) => it.status !== 'acknowledged');

	$: filteredNotifications = filter
		? aknowledgedNotifications.filter((it) => it.type === filter)
		: aknowledgedNotifications;

	returnButton.set({
		label: 'Notifications',
		href: '/mobile-wireframe'
	});
</script>

<div class="notifications">
	<div class="notifications_filters">
		<Button
			selected={filter === 'alert'}
			href={filter === 'alert'
				? window.location.pathname
				: `${window.location.pathname}?filter=alert`}
		>
			Alerts
		</Button>
		<Button
			selected={filter === 'warning'}
			href={filter === 'warning'
				? window.location.pathname
				: `${window.location.pathname}?filter=warning`}
		>
			Warnings
		</Button>
		<Button
			selected={filter === 'notification'}
			href={filter === 'notification'
				? window.location.pathname
				: `${window.location.pathname}?filter=notification`}
		>
			Notifications
		</Button>
	</div>
	<Spacer size="calc(var(--gap) * 2)" />
	<Separation title="Notifications & Alerts:" />
	{#each filteredNotifications as notification}
		<div class="notifications__item">
			<Card href={`/mobile-wireframe/notifications/${notification.id}`}>
				<h4 slot="title">
					{notification.title}
				</h4>
				<span slot="subTitle">
					<span>{notification.type} </span>
				</span>
			</Card>
		</div>
	{/each}
</div>

<style>
	.notifications_filters {
		position: sticky;
		top: var(--layout-vertical-padding);
		display: flex;
		gap: var(--gap);
		justify-content: flex-end;
		align-items: center;
	}

	.notifications__item + .notifications__item {
		margin-top: var(--gap);
	}
</style>
