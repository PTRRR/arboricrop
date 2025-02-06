<script lang="ts">
	import { getCss } from '../../utils/css';
	import { type Notification } from '../../utils/types';
	import Card from './Card.svelte';
	import StatusDot from './StatusDot.svelte';

	const { notification }: { notification: Notification } = $props();
</script>

{#if notification}
	<Card href={`/mobile-layout/notifications/${notification.id}`}>
		<div class="home__info">
			<p>{notification.title}</p>
			<p
				style={getCss({
					fontWeight: 'normal',
					display: 'flex',
					alignItems: 'center',
					gap: '0.5rem'
				})}
			>
				<StatusDot
					status={notification.type === 'alert'
						? 'error'
						: notification?.type === 'warning'
							? 'warning'
							: 'normal'}
				/>
				{notification.type}
			</p>
		</div>
	</Card>
{/if}
