<script lang="ts">
	import type { Notification } from '../../utils/types';
	import StatusDot from '../mobile-layout/StatusDot.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		notification: Notification;
		selected?: boolean;
	}

	const { notification, selected }: Props = $props();
</script>

<a
	href={`/desktop-mvp/notifications?id=${notification.id}`}
	class="notification-card"
	class:notification-card--alert={notification.type === 'alert'}
	class:notification-card--notification={notification.type === 'notification'}
	class:notification-card--warning={notification.type === 'warning'}
	class:notification-card--selected={selected}
>
	<Stack gap="0.5rem" justifyContent="space-between" style={{ flex: ' 1 1 auto' }}>
		<div>
			<Stack direction="horizontal" alignItems="center" gap="0.5rem">
				<StatusDot
					status={notification.type === 'alert'
						? 'error'
						: notification.type === 'warning'
							? 'warning'
							: 'neutral'}
				/>
				<span class="notification-card__title">{notification.title}</span>
			</Stack>
			<p class="notification-card__description">{notification.text}</p>
		</div>
		<span>{notification.status}</span>
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
			color: var(--dark-grey);
		}

		&--selected,
		&:hover {
			background-color: var(--grey);

			#{$root}__description {
				color: var(--dark-grey);
			}
		}
	}
</style>
