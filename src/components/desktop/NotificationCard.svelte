<script lang="ts">
	import type { Notification } from '../../utils/types';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		notification: Notification;
		selected?: boolean;
		mode?: 'minimal' | 'normal';
	}

	const { notification, selected, mode = 'normal' }: Props = $props();
</script>

<a
	href={`/desktop-mvp/notifications?id=${notification.id}`}
	class="notification-card"
	class:notification-card--alert={notification.type === 'alert'}
	class:notification-card--notification={notification.type === 'notification'}
	class:notification-card--warning={notification.type === 'warning'}
	class:notification-card--selected={selected}
	class:notification-card--minimal={mode === 'minimal'}
>
	<Stack
		direction="horizontal"
		alignItems="flex-start"
		gap="0.5rem"
		style={{ flex: ' 1 1 auto', height: '100%' }}
	>
		<Stack style={{ paddingTop: '0.6rem' }}>
			<StatusDot
				status={notification.type === 'alert'
					? 'error'
					: notification.type === 'warning'
						? 'warning'
						: 'neutral'}
			/>
		</Stack>
		<Stack
			gap="0.9rem"
			justifyContent="space-between"
			style={{ flex: ' 1 1 auto', height: '100%' }}
		>
			<Stack gap="0.1rem">
				<span class="notification-card__title">{notification.title}</span>

				{#if mode === 'normal'}
					<p class="notification-card__description">{notification.text}</p>
				{/if}
			</Stack>

			{#if mode === 'normal'}
				<span>{notification.status}</span>
			{/if}
		</Stack>
	</Stack>
</a>

<style lang="scss">
	.notification-card {
		$root: &;
		display: flex;
		flex-direction: column;
		background-color: var(--light-grey);
		padding: 1rem;
		border-radius: 1rem;
		color: var(--black);
		text-decoration: none;

		&__title {
			font-size: var(--mid-font-size);
		}

		&__description {
			color: var(--black);
			font-weight: 200;
		}

		&--selected,
		&:hover {
			background-color: var(--grey);
		}
	}
</style>
