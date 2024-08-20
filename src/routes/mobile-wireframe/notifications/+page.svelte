<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
	import Card from '../../../components/wireframe/Card.svelte';
	import Separation from '../../../components/wireframe/Separation.svelte';
	import { useNotifications, useReturnButton } from '../../../stores';
	import type { Notification, NotificationType } from '../../../utils/types';

	const returnButton = useReturnButton();
	const notifications = useNotifications();

	returnButton.set({
		label: 'Notifications',
		href: '/mobile-wireframe'
	});

	let filter: NotificationType | undefined = undefined;
</script>

<div class="notifications">
	<div class="notifications_filters">
		<Button>Alerts</Button>
		<Button>Warnings</Button>
		<Button>Notifications</Button>
	</div>
	<Spacer size="calc(var(--gap) * 2)" />
	<Separation title="Notifications & Alerts:" />
	{#each $notifications.filter((it) => it.status !== 'acknowledged') as notification}
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
