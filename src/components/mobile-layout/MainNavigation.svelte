<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { useApp } from '../../stores';
	import Stack from '../desktop/Stack.svelte';
	import Button from '../layout/Button.svelte';
	import ActionMenu from './ActionMenu.svelte';
	import PanelOverlay from './PanelOverlay.svelte';

	interface Props {
		baseUrl: string;
	}

	const { baseUrl }: Props = $props();

	let show = $state(false);
	const { isBlurred } = useApp();

	$effect(() => {
		$isBlurred = show;
	});

	onNavigate(() => {
		show = false;
	});
</script>

<ActionMenu>
	<Stack gap="0.5rem" alignItems="flex-end">
		<Button
			onclick={() => (show = !show)}
			padding="5px 5px 5px 10px"
			icon={show ? 'cross' : 'more-vertical'}
			iconOrder="inverted"
			color="var(--white)"
			backgroundColor="var(--black)"
			iconBackgroundColor="var(--black)"
			style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}
		>
			{show ? 'Close' : 'More'}
		</Button>
	</Stack>
</ActionMenu>

{#if show}
	<PanelOverlay>
		<div class="panel-overlay__links">
			<a href={`${baseUrl}/`}>Trials</a>
			<a href={`${baseUrl}/notifications`}>Notifications</a>
			<a href={`${baseUrl}/settings`}>Settings</a>
			<a href={`${baseUrl}/account`}>Account</a>
		</div>
	</PanelOverlay>
{/if}

<style lang="scss">
	.panel-overlay__links {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		a {
			color: black;
			text-decoration: none;
			font-size: var(--big-font-size);
		}
	}
</style>
