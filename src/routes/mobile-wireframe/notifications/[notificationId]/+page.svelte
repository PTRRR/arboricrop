<script lang="ts">
	import { page } from '$app/stores';
	import Spacer from '../../../../components/Spacer.svelte';
	import Button from '../../../../components/wireframe/Button.svelte';
	import Separation from '../../../../components/wireframe/Separation.svelte';
	import { useNotifications, useReturnButton } from '../../../../stores';

	const returnButton = useReturnButton();
	const notifications = useNotifications();

	$: notification = $notifications.find((it) => it.id === $page.params.notificationId);

	$: {
		if (notification) {
			returnButton.set({
				label: notification?.title || '',
				href: '/mobile-wireframe/notifications'
			});
		}
	}
</script>

{#if $page.data.acknowledge}
	<div class="notification-acknowledge">
		<p>Acknowledge: {notification?.title}</p>
		<Spacer />
		<textarea placeholder="Personal note" />
		<Spacer />
		<Button
			href="/mobile-wireframe/notifications"
			on:click={() => {
				if (notification) {
					const notificationIndex = $notifications.findIndex((it) => it.id === notification.id);
					if (notificationIndex > -1) {
						const newNotifications = [...$notifications];
						newNotifications[notificationIndex] = {
							...newNotifications[notificationIndex],
							status: 'acknowledged'
						};
						notifications.set(newNotifications);
					}
				}
			}}
		>
			Confirm
		</Button>
		<Spacer />
		<Button href={window.location.pathname}>Cancel</Button>
	</div>
{:else}
	<Separation title="General information:" />
	<label for="">Status:</label>
	<span>{notification?.status}</span>
	<Spacer />
	<label for="">Type:</label>
	<span>{notification?.type}</span>
	<Spacer />
	<label for="">Description:</label>
	<span>{notification?.text}</span>
	<Spacer />
	<Spacer />
	<Spacer />
	<Spacer />
	<Separation title="Actions:" />
	<span>{notification?.actionableInsight}</span>
	<Spacer />
	<Spacer />
	<Button href={`/mobile-wireframe/devices/${notification?.deviceId}`}>Open device</Button>
	<Spacer />
	<Button href={`${window.location.pathname}?acknowledge=true`}>Acknowledge</Button>
{/if}

<style>
	label {
		color: var(--dark-gray);
	}

	textarea {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}

	.notification-acknowledge {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 1 auto;
	}
</style>
