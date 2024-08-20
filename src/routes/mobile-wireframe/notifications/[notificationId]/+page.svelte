<script lang="ts">
	import { page } from '$app/stores';
	import Spacer from '../../../../components/Spacer.svelte';
	import Button from '../../../../components/wireframe/Button.svelte';
	import Image from '../../../../components/wireframe/Image.svelte';
	import Info from '../../../../components/wireframe/Info.svelte';
	import Separation from '../../../../components/wireframe/Separation.svelte';
	import { useNotifications, useReturnButton } from '../../../../stores';
	import { formatDateToDDMMYYYY } from '../../../../utils/dates';

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
	<Info label="Date:" value={formatDateToDDMMYYYY(new Date(notification?.date || ''))} />
	<Spacer />
	<Info label="Status:" value={notification?.status} />
	<Spacer />
	<Info label="Type:" value={notification?.type} />
	<Spacer />
	<Info label="Description:" value={notification?.text} />
	<Spacer />
	<Spacer />
	<Spacer />
	<Spacer />
	<Separation title="Actions:" />
	<span>{notification?.actionableInsight}</span>
	<Spacer />
	<Image ratio={1} placeholder="Comprehensive schema / animation explaining how to proceed" />
	<Spacer />
	<Button href={`/mobile-wireframe/devices/${notification?.deviceId}`}>See device</Button>
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
