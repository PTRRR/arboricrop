<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { useApp } from '../../stores';
	import Stack from '../desktop/Stack.svelte';
	import Button from '../layout/Button.svelte';
	import ActionMenu from './ActionMenu.svelte';

	let show = $state(false);
	const { isBlurred } = useApp();

	const getButtonStyle = $derived((index: number): Partial<CSSStyleDeclaration> => {
		return {
			pointerEvents: show ? undefined : 'none',
			opacity: show ? '1' : '0',
			transform: show ? 'translate(0, 0)' : 'translate(0, 80%)',
			transition: show
				? `opacity 0.5s ${index * 0.1}s cubic-bezier(0.83, 0, 0.17, 1), transform 0.3s ${index * 0.1}s cubic-bezier(0.83, 0, 0.17, 1)`
				: `opacity 0.5s ${(3 - index) * 0.1}s cubic-bezier(0.83, 0, 0.17, 1), transform 0.3s ${(3 - index) * 0.1 + 1}s cubic-bezier(0.83, 0, 0.17, 1)`
		};
	});

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
			padding
			icon="user"
			iconOrder="inverted"
			backgroundColor="var(--light-grey)"
			borderColor="var(--grey)"
			href="/mobile-mvp/account"
			style={getButtonStyle(2)}>Account</Button
		>
		<Button
			padding
			icon="gear"
			iconOrder="inverted"
			backgroundColor="var(--light-grey)"
			borderColor="var(--grey)"
			href="/mobile-mvp/settings"
			style={getButtonStyle(1)}>Settings</Button
		>
		<Button
			padding
			icon="notification"
			iconOrder="inverted"
			backgroundColor="var(--light-grey)"
			borderColor="var(--grey)"
			href="/mobile-mvp/notifications"
			style={getButtonStyle(0)}>Notifications</Button
		>
		<Button
			onclick={() => (show = !show)}
			padding="5px 5px 5px 10px"
			icon={show ? 'cross' : 'more-vertical'}
			iconOrder="inverted"
			color="var(--white)"
			backgroundColor="var(--black)"
			borderColor="var(--grey)"
			iconBackgroundColor="var(--black)"
			style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}
		>
			More
		</Button>
	</Stack>
</ActionMenu>

{#if show}
	<ActionMenu></ActionMenu>

	<ActionMenu></ActionMenu>

	<ActionMenu></ActionMenu>
{/if}
